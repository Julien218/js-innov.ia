#!/bin/bash
# Mise en ligne automatique du site jsinnovia.com sur le serveur IONOS (31.70.173.171).
#
# Installé dans /usr/local/bin/jsinnovia-site-deploy par deploy/ionos/install-site-auto-deploy.sh.
# Appelé uniquement par la clé SSH de GitHub Actions du dépôt js-innov.ia, qui ne peut lancer RIEN D'AUTRE
# (authorized_keys : command="/usr/local/bin/jsinnovia-site-deploy",restrict).
#
#   ssh … "deploy <sha40>" < site.tar.gz   construit, teste, bascule, revient en arrière si besoin
#   ssh … "status"                         état du site (lecture seule)
#
# Le script ne modifie PAS la configuration Coolify : il retrouve le conteneur du site en ligne
# (étiquettes Docker Compose), construit la nouvelle image puis lui donne le NOM d'image que cette
# configuration attend. Le bouton Redeploy de Coolify retrouve donc aussi la bonne image.
# N'affiche aucune valeur secrète.
set -u
umask 077

RELEASES=/srv/jsinnovia/releases
LOCK=/run/jsinnovia-site-deploy.lock
MAX_ARCHIVE_BYTES=$((300 * 1024 * 1024))
SMOKE_PORT=18090

log() { echo "[$(date +%H:%M:%S)] $*"; }
fail() { echo; echo "ÉCHEC : $*"; echo "Le site en ligne n'a pas été modifié."; exit 1; }

# Conteneur du site en ligne : service Compose nommé website/site/jsinnovia-site, en marche.
find_site() {
  SITE_CONTAINER=""
  for id in $(docker ps -q); do
    svc=$(docker inspect --format '{{index .Config.Labels "com.docker.compose.service"}}' "$id" 2>/dev/null)
    case "$svc" in website|site|jsinnovia-site) SITE_CONTAINER=$id; break ;; esac
  done
  [ -n "$SITE_CONTAINER" ] || return 1
  label() { docker inspect --format "{{index .Config.Labels \"$1\"}}" "$SITE_CONTAINER"; }
  SITE_NAME=$(docker inspect --format '{{.Name}}' "$SITE_CONTAINER" | sed 's#^/##')
  SITE_SERVICE=$(label com.docker.compose.service)
  SITE_PROJECT=$(label com.docker.compose.project)
  SITE_DIR=$(label com.docker.compose.project.working_dir)
  SITE_FILES=$(label com.docker.compose.project.config_files)
  SITE_IMAGE=$(docker inspect --format '{{.Config.Image}}' "$SITE_CONTAINER")
  SITE_PORT=$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$SITE_CONTAINER" | sed -n 's/^PORT=//p' | head -1)
  SITE_PORT=${SITE_PORT:-8080}
}

site_health() {
  docker exec "$1" wget -q -O - "http://127.0.0.1:${2}/api/health" 2>/dev/null | grep -q '"status":"ok"'
}

status() {
  find_site || { echo "Aucun conteneur de site trouvé (service website/site)."; return 0; }
  local ok=non; site_health "$SITE_CONTAINER" "$SITE_PORT" && ok=oui
  local shop
  shop=$(docker exec "$SITE_CONTAINER" wget -q -O - "http://127.0.0.1:${SITE_PORT}/api/shop/status" 2>/dev/null || echo "absente")
  echo "Site : conteneur $SITE_NAME, service $SITE_SERVICE (projet $SITE_PROJECT), image $SITE_IMAGE"
  echo "Santé : $ok · boutique : $shop"
}

ORIG=${SSH_ORIGINAL_COMMAND:-${1:-} ${2:-}}
read -r ACTION ARG <<<"$ORIG"
case "$ACTION" in
  status) status; exit 0 ;;
  deploy) ;;
  *) echo "Commande refusée. Seules « deploy <sha> » et « status » sont permises."; exit 2 ;;
esac
[[ "$ARG" =~ ^[0-9a-f]{40}$ ]] || { echo "Identifiant de version invalide."; exit 2; }
SHA=${ARG:0:7}

exec 9>"$LOCK"
flock -n 9 || { echo "Une mise en ligne du site est déjà en cours. Réessayez dans quelques minutes."; exit 3; }

TAG="jsinnovia-site:$SHA"
REL="$RELEASES/site-$SHA"
ARCHIVE="$REL/source.tar.gz"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
SMOKE=jsinnovia-site-smoke-$SHA

log "1/6 Réception du code $SHA"
rm -rf "$REL" && mkdir -p "$REL/source" || fail "dossier de version"
head -c $((MAX_ARCHIVE_BYTES + 1)) > "$ARCHIVE"
SIZE=$(stat -c %s "$ARCHIVE")
[ "$SIZE" -gt 1000 ] || fail "archive vide"
[ "$SIZE" -le "$MAX_ARCHIVE_BYTES" ] || fail "archive trop grosse"
tar -xzf "$ARCHIVE" -C "$REL/source" < /dev/null || fail "extraction de l'archive"

log "2/6 Vérifications"
docker compose version >/dev/null 2>&1 || fail "docker compose indisponible"
find_site || fail "conteneur du site en ligne introuvable (service website/site) — rien n'a été touché"
[ -n "$SITE_PROJECT" ] && [ -n "$SITE_DIR" ] && [ -n "$SITE_FILES" ] || fail "le conteneur du site n'est pas géré par Docker Compose"
log "Site en ligne : $SITE_NAME (service $SITE_SERVICE, projet $SITE_PROJECT), image attendue $SITE_IMAGE"
site_health "$SITE_CONTAINER" "$SITE_PORT" || log "Attention : le site actuel ne répond pas à /api/health"
COMPOSE_ARGS=(-p "$SITE_PROJECT" --project-directory "$SITE_DIR")
IFS=',' read -ra FILES <<<"$SITE_FILES"
for f in "${FILES[@]}"; do [ -f "$f" ] || fail "fichier Compose $f introuvable"; COMPOSE_ARGS+=(-f "$f"); done

log "3/6 Construction de l'image $TAG (plusieurs minutes)"
docker build --label org.opencontainers.image.source=https://github.com/Julien218/js-innov.ia \
  --label org.opencontainers.image.revision="$ARG" -t "$TAG" "$REL/source" < /dev/null > "$REL/build.log" 2>&1 \
  || { tail -25 "$REL/build.log"; fail "construction de l'image (journal : $REL/build.log)"; }

log "4/6 Test de la nouvelle image à côté de la production"
docker rm -f "$SMOKE" >/dev/null 2>&1
docker run -d --name "$SMOKE" -e PORT=8080 -p 127.0.0.1:$SMOKE_PORT:8080 "$TAG" < /dev/null >/dev/null || fail "démarrage du test"
ok=0; for _ in $(seq 1 20); do curl -fs "http://127.0.0.1:$SMOKE_PORT/api/health" 2>/dev/null | grep -q '"status":"ok"' && { ok=1; break; }; sleep 2; done
HOME_PAGE=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT/")
OFFERS=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT/offres")
SHOP=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT/api/shop/status")
docker rm -f "$SMOKE" >/dev/null 2>&1
[ "$ok" = 1 ] && [ "$HOME_PAGE" = 200 ] && [ "$OFFERS" = 200 ] && [ "$SHOP" = 200 ] \
  || fail "test de l'image : santé=$ok accueil=$HOME_PAGE offres=$OFFERS boutique=$SHOP"
log "Test réussi"

log "5/6 Bascule du site"
PREVIOUS_IMAGE_ID=$(docker inspect --format '{{.Image}}' "$SITE_CONTAINER")
BACKUP_TAG="jsinnovia-site:avant-$SHA-$STAMP"
docker tag "$PREVIOUS_IMAGE_ID" "$BACKUP_TAG" || fail "sauvegarde de l'image actuelle"
docker tag "$TAG" "$SITE_IMAGE" || fail "nommage de la nouvelle image"
rollback() {
  echo; echo "RETOUR EN ARRIÈRE : $*"
  docker tag "$BACKUP_TAG" "$SITE_IMAGE"
  (cd "$SITE_DIR" && docker compose "${COMPOSE_ARGS[@]}" up -d --no-deps --no-build --force-recreate "$SITE_SERVICE" < /dev/null) >/dev/null 2>&1
  sleep 10
  echo "Version précédente remise en ligne."
  exit 1
}
(cd "$SITE_DIR" && docker compose "${COMPOSE_ARGS[@]}" up -d --no-deps --no-build --force-recreate "$SITE_SERVICE" < /dev/null) > "$REL/rollout.log" 2>&1 \
  || { tail -10 "$REL/rollout.log"; rollback "le redémarrage du site a échoué"; }

log "6/6 Contrôle du site en ligne (jusqu'à 2 minutes)"
healthy=0; for _ in $(seq 1 24); do
  find_site && site_health "$SITE_CONTAINER" "$SITE_PORT" && { healthy=1; break; }; sleep 5
done
[ "$healthy" = 1 ] || rollback "le nouveau site ne répond pas"
PUBLIC=$(curl -s -o /dev/null -w '%{http_code}' https://www.jsinnovia.com/offres)
printf '{"deployed":"%s","revision":"%s","as":"%s","backup":"%s","at":"%s","public_offres":"%s"}\n' \
  "$TAG" "$ARG" "$SITE_IMAGE" "$BACKUP_TAG" "$STAMP" "$PUBLIC" > "$REL/deployment-receipt.json"

# Ménage : on garde les 5 dernières versions du code, des images et des sauvegardes.
ls -1dt "$RELEASES"/site-* 2>/dev/null | tail -n +6 | while read -r old; do rm -rf "$old/source" "$old/source.tar.gz"; done
for repo_prefix in "jsinnovia-site:avant-" "jsinnovia-site:"; do
  docker images --format '{{.Repository}}:{{.Tag}} {{.CreatedAt}}' jsinnovia-site | grep "^$repo_prefix" | sort -k2 -r | tail -n +6 | awk '{print $1}' \
    | while read -r img; do [ "$img" = "$TAG" ] || [ "$img" = "$BACKUP_TAG" ] || docker rmi "$img" >/dev/null 2>&1; done
done
echo
echo "TERMINÉ : jsinnovia.com tourne avec $TAG (page /offres publique : HTTP $PUBLIC)."
echo "Retour possible : docker tag $BACKUP_TAG $SITE_IMAGE puis Redeploy du site."

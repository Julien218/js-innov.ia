#!/bin/bash
# Installation unique de la mise en ligne automatique du SITE, à lancer en root sur le serveur IONOS :
#
#   curl -fsSL https://raw.githubusercontent.com/Julien218/js-innov.ia/main/deploy/ionos/install-site-auto-deploy.sh | bash
#
# - installe /usr/local/bin/jsinnovia-site-deploy (téléchargé depuis le dépôt, branche main) ;
# - crée une clé SSH réservée à GitHub Actions, limitée à CE SEUL script
#   (command=…, restrict : ni terminal, ni redirection de ports, ni autre commande) ;
# - affiche la clé privée à coller dans GitHub (secret IONOS_SITE_DEPLOY_KEY du dépôt js-innov.ia).
# Relancer l'installation remplace l'ancienne clé par une nouvelle.
set -eu
[ "$(id -u)" = 0 ] || { echo "À lancer en root."; exit 2; }
RAW=https://raw.githubusercontent.com/Julien218/js-innov.ia/main/deploy/ionos/jsinnovia-site-deploy.sh
TMP=$(mktemp)
curl -fsSL "$RAW" -o "$TMP"
bash -n "$TMP"
install -m 0700 -o root -g root "$TMP" /usr/local/bin/jsinnovia-site-deploy
rm -f "$TMP"

umask 077
mkdir -p /root/.ssh /root/jsinnovia-site-deploy-key
KEYFILE=/root/jsinnovia-site-deploy-key/github-actions-jsinnovia-site-deploy
rm -f "$KEYFILE" "$KEYFILE.pub"
ssh-keygen -q -t ed25519 -N "" -C github-actions-jsinnovia-site-deploy -f "$KEYFILE"
touch /root/.ssh/authorized_keys
grep -v 'github-actions-jsinnovia-site-deploy' /root/.ssh/authorized_keys > /root/.ssh/authorized_keys.new || true
echo "command=\"/usr/local/bin/jsinnovia-site-deploy\",restrict $(cat "$KEYFILE.pub")" >> /root/.ssh/authorized_keys.new
chmod 600 /root/.ssh/authorized_keys.new
mv /root/.ssh/authorized_keys.new /root/.ssh/authorized_keys

echo
/usr/local/bin/jsinnovia-site-deploy status
echo
echo "MISE EN LIGNE AUTOMATIQUE DU SITE INSTALLÉE."
echo "Copiez TOUT le bloc ci-dessous (de -----BEGIN à -----END inclus) dans GitHub :"
echo "js-innov.ia → Settings → Secrets and variables → Actions → New repository secret → nom : IONOS_SITE_DEPLOY_KEY"
echo
cat "$KEYFILE"
echo
echo "Ensuite, effacez la copie locale : rm -rf /root/jsinnovia-site-deploy-key"

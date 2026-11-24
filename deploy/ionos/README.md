# Mise en ligne automatique du site sur IONOS

À chaque fusion dans `main`, le workflow **Mise en ligne IONOS** (`.github/workflows/deploy-ionos.yml`) :

1. lance les tests, le lint et le build ;
2. envoie le code au serveur **31.70.173.171** par SSH, avec une clé qui ne peut lancer **que** `/usr/local/bin/jsinnovia-site-deploy` ;
3. le serveur retrouve le conteneur du site en ligne (service Compose `website`), construit la nouvelle image, la teste à côté (`/api/health`, `/`, `/offres`, `/api/shop/status`), lui donne le nom d'image attendu par la configuration Coolify, redémarre le seul service du site, contrôle sa santé et **revient tout seul à l'image précédente** si le nouveau site ne répond pas.

La configuration Coolify (variables d'environnement, domaines) n'est pas modifiée. Comme l'image porte le nom attendu, le bouton Redeploy de Coolify la retrouve aussi.

Lancer à la main : onglet **Actions** de GitHub → « Mise en ligne IONOS » → **Run workflow**.

## Installation (une seule fois)

Sur le serveur, en root :

```bash
curl -fsSL https://raw.githubusercontent.com/Julien218/js-innov.ia/main/deploy/ionos/install-site-auto-deploy.sh | bash
```

Le script affiche une clé privée : la coller dans GitHub → `js-innov.ia` → Settings → Secrets and variables → Actions → secret **`IONOS_SITE_DEPLOY_KEY`**. Puis effacer la copie locale (`rm -rf /root/jsinnovia-site-deploy-key`).

État du site à tout moment : `jsinnovia-site-deploy status`.

## Retirer l'accès de GitHub

Sur le serveur : supprimer la ligne contenant `github-actions-jsinnovia-site-deploy` dans `/root/.ssh/authorized_keys`, ou supprimer le secret dans GitHub.

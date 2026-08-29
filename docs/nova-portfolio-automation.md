# Publication automatique NOVA → Portfolio

Le site lit la table `Showcase` de NOVA à chaque ouverture du portfolio. Un média n'est affiché que si NOVA fournit explicitement :

```json
{
  "title": "Nom public de la réalisation",
  "client_name": "Nom du client",
  "description": "Description publique validée",
  "media_type": "video",
  "media_url": "https://...",
  "integrity_hash": "sha256-ou-identifiant-unique",
  "portfolio_status": "approved",
  "portfolio_approved": true,
  "category": "Présentation client",
  "technologies": ["Vidéo", "NOVA"]
}
```

## Règles NOVA

1. À chaque nouvelle image ou vidéo livrée, NOVA détecte un candidat portfolio.
2. NOVA marque automatiquement `portfolio_approved: true` uniquement quand l'instruction de l'utilisateur contient une demande explicite de publication au portfolio. Sinon, le média reste candidat privé.
3. NOVA vérifie que le client autorise la présentation publique et prépare un titre et une description sans données confidentielles.
4. Après validation, NOVA crée un lien public en lecture seule, puis un enregistrement `Showcase` avec `portfolio_status: approved`.
5. L'empreinte `integrity_hash` empêche de publier deux fois le même fichier.
6. Les noms contenant `Non video`, `brouillon`, `draft`, `test`, `essai` ou `temporaire` sont refusés par le site même s'ils sont envoyés par erreur.
7. Retirer l'approbation ou supprimer l'enregistrement `Showcase` retire automatiquement la réalisation du flux dynamique.

Les fichiers lourds ne sont chargés qu'après un clic du visiteur. Le chargement initial du site ne télécharge donc pas les vidéos Dropbox.

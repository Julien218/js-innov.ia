# Web Studio et accueil adaptatif

## Périmètre
Le site public fonctionne dans `Julien218/js-innov.ia`, avec `SaasLanding` comme accueil du domaine principal. Le dépôt `Julien218/jsinnovia` est un ancien site statique de redirection : y déposer un fichier ne publie pas une nouvelle route sur le site React actuel. Vérifier la source et le SHA du service portant `jsinnovia.com` avant tout déploiement ; ne pas redéployer le redirecteur à la place de l’application.

## Fonctionnement
- `/web-studio` : 18 concepts, 9 activités et 6 compositions, aperçus interactifs, formats ordinateur/tablette/téléphone, filtres et recherche.
- `/web-studio.html` : compatibilité avec le lien annoncé précédemment.
- L’accueil adapte titre, explication, action principale et parcours conseillé à l’objectif choisi. Tous les autres services restent accessibles.
- Les critères de recommandation sont lisibles : activité explicite prioritaire, activité seulement suggérée à partir de texte, style choisi et compositions consultées pendant la visite.
- L’analyse sur demande réutilise `analyzeSEO` et ses mesures du HTML initial. Elle ne rend pas le JavaScript distant. Si les indices sont faibles ou contradictoires, le moteur s’abstient. Il ne s’agit pas d’une identification du visiteur, ni d’une génération LLM.
- Les champs et les métadonnées distantes sont rendus comme texte React. Aucun HTML tiers ni script fourni par un visiteur n’est exécuté.
- Les logos raster sont limités à 2 Mo, réencodés localement et non envoyés ni persistés.
- Le brief est envoyé uniquement après validation via `submitElyneaRequest`, avec le mécanisme de consentement existant. La confirmation exige `transmitted`, `verified`, `request_id` et `journal_id`. Une nouvelle tentative identique réutilise sa clé d’idempotence.

## Confidentialité et séparation
Les choix restent en mémoire par défaut. L’option de mémorisation conserve seulement activité choisie, objectif, modèle et couleur pendant 30 jours. Nom, adresse analysée, indices et historique des aperçus n’y sont pas conservés. Réinitialiser efface cette préférence et les paramètres publics de personnalisation. Cette fonctionnalité n’ajoute aucun pixel de suivi, aucune empreinte de navigateur, aucun enrichissement d’identité, aucune géolocalisation. Les comportements historiques des autres composants ne sont pas modifiés.

Les parcours d’accueil HainoFlow, Signage et Cockpit sont conservés. Le lien de navigation Web Studio n’est pas ajouté à leurs domaines spécialisés. Aucun tarif, témoignage, indicateur de performance ou résultat commercial n’est inventé.

## Vérification
`node --test tests/web-studio.test.cjs` vérifie recommandations, abstention, entrées, stockage et confirmations. La CI normale assure lint, typecheck, tests et build. Le workflow `Web Studio browser checks` utilise un navigateur temporaire, des API simulées et des captures desktop/mobile ; il n’envoie aucun vrai prospect. Aucun nouvel abonnement ni dépendance de production n’est ajouté.

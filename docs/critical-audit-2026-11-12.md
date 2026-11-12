# Audit critique JS-Innov.IA — 12 novembre 2026

**Décision : NO-GO pour la vente et la livraison vidéo. Aucun déploiement réalisé. Aucun paiement réel activé.**

Branche de corrections : `codex/critical-audit-20261112`, créée depuis `main` (`1da347c41a5c4f3f40ae0b62cbcadf5b60bab540`). Le chantier non commité `codex/video-commerce-test-20261112` a été préservé, sans modification. Ses résultats ne sont pas ceux du site public.

Les preuves détaillées de cette exécution sont conservées dans le workspace, sous `outputs/critical-audit-20261112/`. Les captures et les JSON sont datés ; un manifeste SHA-256 permet d'en contrôler l'intégrité. La matrice CSV détaille les contrôles et les dépendances bloquantes. Les résultats locaux ne constituent pas une validation de production.

## État réellement déployé

- `jsinnovia.com` et `validation.jsinnovia.com` répondent en HTTPS. DNS du site : `31.70.173.171`.
- IONOS : image du site `jsinnovia-site:ionos-canonical`, ID `sha256:07cc677d2bfd1d0de76ee4cf3db76cdf447ada6e3f8bc3b5aa95ad3fee33e5c4`. Conteneur sain.
- Empreinte du serveur déployé : `f0c3926611aadcbaac88fef35b50b6bb91595a02ce613611e3773cbd952c2440`, identique au fichier du checkout local de `migration/ionos-hosting` (`e1d4315`). Cela identifie ce fichier ; cela ne prouve pas à lui seul l'identité de tous les assets de l'image.
- IONOS Cockpit : image `jsinnovia-cockpit:cosmic-709f5a2`, ID `sha256:dbd745d7d5d39ece653423fab3a23638bfefa67fc495a443d29da38e2f19f5c6`, conteneur sain. `server-client-videos.cjs` absent ; route `/api/client-videos` absente du serveur inspecté.
- Aucune variable de commerce vidéo ou Stripe trouvée dans les deux conteneurs inspectés ; aucune valeur de secret enregistrée dans le rapport.
- Les anciens services Railway site et Cockpit inspectés n'ont pas de déploiement actif. Leur dernier statut historique FAILED ne décrit pas la santé actuelle d'IONOS.
- PR site [#43](https://github.com/Julien218/js-innov.ia/pull/43) ouverte, portant la redirection canonique `www`. La branche d'audit préserve explicitement cette redirection déjà en production. Ne pas réinstaller `main` nu par-dessus la version IONOS.
- La branche Cockpit `feature/videos-clients` contient un module vidéo et sa migration, mais le fichier correspondant est absent de `main` et du conteneur public inspecté. Ne pas assimiler sa documentation à une intégration déployée.

## Défauts critiques et corrections préparées

| Contrôle | Production observée | Branche locale | Preuve |
|---|---|---|---|
| `/PaymentSuccess` sans session | FAIL : succès, email envoyé et livraison sous 24 h annoncés sans preuve | PASS : message d'indisponibilité, aucun paiement annoncé | `legacy-success.png`, `corrected-success.png`, `local-critical-ui.json` |
| Ancien checkout | FAIL dans le code : champs carte/CVC, temporisation, commande en localStorage | PASS : formulaire et simulation supprimés, panier conservé | diff des trois pages, test de non-régression |
| Confirmation depuis localStorage | FAIL : données du navigateur considérées comme commande confirmée | PASS : page neutralisée | test `legacy checkout...` |
| Configurateur vidéo public | FAIL : `/videos`, `/commander-video`, `/espace-video` affichent 404 ; HTTP 200 | BLOCKED : chantier commerce séparé, non intégré à cette PR | `public-browser.json` |
| API commerce publique | FAIL : `/api/video/catalog` renvoie du HTML avec HTTP 200 | PASS pour le comportement HTTP : API inconnue = JSON 404. Commerce toujours absent | `public-http.json`, test HTTP |
| Page client existante | PASS pour la présence HTML, FAIL pour son raccordement API | BLOCKED : module Cockpit non déployé et aucun lien client de test valide créé | `validation-browser.json`, `ionos-evidence.json` |
| Accès sans jeton de validation | PASS : message « lien incomplet » | Inchangé | `invalid.png` |
| Jeton fictif de forme correcte | FAIL d'intégration : « Failed to fetch », route API publique 404 | BLOCKED : ne prouve pas la gestion métier des expirations | `missing-api.png`, `security-http.json` |
| `/robots.txt` et `/sitemap.xml` | FAIL : accueil HTML | PASS local : types et contenus adaptés | test HTTP, `public-http.json` |
| URL inexistante et asset absent | FAIL : HTTP 200 | PASS local : 404 et noindex | test HTTP |
| Canonicals de pages internes | FAIL : accueil réutilisé | PASS local : canonical du chemin, sans query ; mise à jour à la navigation | `local-browser.json`, tests |
| Pages transactionnelles | Indexables dans l'ancien HTML | PASS local : en-tête et meta noindex | test HTTP |
| Cache des assets non hashés | Un an immutable | PASS local : revalidation ; immutable réservé aux assets hashés | test HTTP |
| Paramètres d'URL dans postMessage parent | URL complète transmise | PASS local : origine et chemin uniquement | test de non-régression |
| Musique et fidélité à 390 px | FAIL : débordements horizontaux | PASS local : document = 390 px pour viewport = 390 px | `public-route-crawl.json`, `local-critical-ui.json` |
| Fidélité | Données fictives présentées comme compte client | PASS local : bandeau de démonstration explicite | diff `Fidelite.jsx` |
| Dépendances production | FAIL : `follow-redirects` et `zod`, sévérité élevée | PASS : audit production à zéro vulnérabilité à la date du test | audits avant/après |

Le checkout est neutralisé intentionnellement. Cette PR ne prétend pas le remplacer par un système de paiement opérationnel. Le seul montant conservé dans le parcours vidéo séparé est calculé côté serveur ; aucun prix envoyé par le navigateur ne doit faire autorité.

## Tests exécutés

- `npm ci --ignore-scripts --no-audit --no-fund` : PASS avec le lockfile final. Correctifs ciblés `follow-redirects@1.16.3` et `zod@4.6.7`. Le passage de Zod 3 à 4 est un changement majeur : typecheck, build et tests sont passés ; aucun import direct de Zod n'a été trouvé dans `src`.
- Suite initiale : 72/72 PASS. Elle laissait passer les faux succès commerciaux ; ce résultat seul était insuffisant.
- Suite avec non-régressions : 75/75 PASS. Le test HTTP démarre un vrai serveur dans un répertoire temporaire et vérifie 404, formats robots/sitemap, canonical, query exclue, noindex, HEAD, méthode interdite, probes sensibles et redirection `www`.
- `npm run lint` : PASS avec avertissements existants, zéro erreur. `npm run typecheck`, `npm run validate:elyna`, `npm run build`, `git diff --check` : PASS.
- Audit `npm audit --omit=dev --json` : PASS, zéro vulnérabilité de production déclarée. Cela ne garantit pas l'absence de vulnérabilités applicatives.
- Navigateur Chromium : 18 parcours initiaux à 1440 et 390 px, puis 52 routes publiques détectées dans le routeur à ces deux largeurs, soit 104 observations supplémentaires. Pas de formulaire envoyé. Les routes administratives et les chemins paramétrés sans objet de test ne sont pas assimilés à des parcours validés.
- Le crawl rapide a déclenché des HTTP 429 sur des lectures de données : la protection a été conservée. Ces observations sont annotées comme limites du crawl et ne prouvent pas une panne fonctionnelle. Les contrôles initiaux plus lents et les lectures ciblées restent distincts.
- Vérification locale navigateur : 18 chemins × deux largeurs, plus les contrôles ciblés des trois anciennes pages transactionnelles et des deux débordements corrigés. Pas d'erreur JS sur ces observations.
- Prototype séparé : `node --test tests/video-commerce.test.cjs` : 1/1 PASS, test intégré local avec client Stripe simulé et signatures de fixture. Tarifs 4 999/10 000 centimes, accès privé/croisé, signature invalide, montant erroné, événement impayé, succès différé, duplication de webhook, blocage avant paiement, validation interne, correction client, nouvelle validation et persistance sont exercés. **Aucun paiement Stripe distant ni email ni appel de production vidéo n'est validé par ce test.** Les médias de fixture ne prouvent pas la qualité ou la décodabilité d'un vrai film.

## Performances et accessibilité

Lighthouse 13.6.0, accueil public, une exécution par mode le 12 novembre 2026 :

| Mesure | Mobile simulé | Desktop |
|---|---:|---:|
| Performance | 88/100 | 95/100 |
| Accessibilité automatique | 91/100 | 91/100 |
| Bonnes pratiques | 100/100 | 100/100 |
| SEO automatique | 92/100 | 92/100 |
| LCP | 3,0 s | 1,0 s |
| FCP | 3,0 s | 1,0 s |
| TBT | 90 ms | 0 ms |
| CLS | 0,001 | 0,023 |

Les rapports HTML/JSON sont conservés. Ce sont des mesures de laboratoire, pas des données terrain ni une garantie sur tous les appareils. La bonne note SEO ne détecte pas tous les problèmes du parcours : robots HTML et soft-404 ont été constatés séparément. Le build garde des chunks de plus de 500 kB et signale que Web Studio est importé à la fois statiquement et dynamiquement.

Corrections d'accessibilité préparées : contraste du pied de page, nom accessible WhatsApp, cohérence du libellé vocal et niveau du titre dans la démonstration Web Studio. Leur retest Lighthouse local mobile obtient 100/100 en accessibilité automatique et 100/100 en SEO ; les cinq contrôles ciblés (contraste, nom de lien, nom accessible, titres, robots) passent. Cette mesure locale ne remplace pas un retest public après déploiement autorisé. Navigation clavier complète, lecteur d'écran, Safari/iOS, appareil Android réel et réseau mobile réel restent BLOCKED faute d'environnement de test dédié.

## Blocages P0 avant un vrai end-to-end

1. **Environnement TEST isolé** : intégrer et relire le chantier commerce, figer les versions, disposer d'une base et d'un stockage de test privés et d'un domaine de recette. Vérifier que clés et événements LIVE sont refusés. Aucun secret dans le navigateur ou ce rapport.
2. **Stripe distant TEST** : créer puis payer les offres 1 min/49,99 € et 3 min/100 € en sandbox ; vérifier événement distant signé, signature erronée, montant/devise/commande, paiement refusé, expiration, échec différé, absence du retour navigateur, duplication et concurrence. Prouver une seule commande et un seul traitement malgré redélivraisons et redémarrage.
3. **Stockage privé** : clients A/B séparés ; fichiers réels JPEG/PNG/MP4, faux MIME, fichier tronqué, trop volumineux, total dépassé, interruption/reprise, suppression/rétention, URL expirée et absence de lecture publique. Le prototype local n'apporte pas toutes ces garanties ; sa signature de fichier seule n'est pas une validation de média complet.
4. **Cockpit/Elynea** : une seule référence commande, prise de travail atomique, reprise après erreur, statut synchronisé, aucune génération payante sans configuration TEST maîtrisée. Vérifier les migrations sur recette et l'isolation des projets ; ne pas importer des clients d'un autre périmètre par commodité.
5. **Validation interne obligatoire** : vérifier côté serveur qu'aucune prévisualisation, notification client ou livraison ne précède l'approbation humaine de la version courante. Chaque remplacement et correction invalide l'approbation antérieure.
6. **Réutilisation de la validation client existante** : monter son API en recette ; créer un vrai lien test, vérifier CORS, preview, demande de corrections, refus, approbation unique, ancien lien invalidé, expiration et contrôle d'accès. Éviter un deuxième système de validation client concurrent.
7. **Livraison** : preuve de téléchargement du film correct par le bon client, accès croisé refusé, URL expirée, intégrité et lecture du média final. Ne pas publier automatiquement sur un réseau social dans le cadre d'une simple livraison.
8. **Emails** : boîte de test dédiée, outbox persistante et clé d'idempotence ; vérifier une seule notification après autorisation, erreurs fournisseur et reprise. Un code HTTP accepté ne prouve pas la réception en boîte. Aucun envoi à un vrai client pendant cet audit.
9. **Promesse 24 h** : définir le départ (paiement confirmé + dossier complet), capacité humaine, horodatages, alertes et conduite en cas de retard. Pas de garantie affichée tant que cette capacité n'est pas démontrée.

## Go / no-go

**GO uniquement après** : tous les P0 ci-dessus PASS avec références et preuves de recette ; aucun FAIL de sécurité ou fausse confirmation ; cycle réel TEST complet visite → configuration → upload privé → paiement TEST → webhook → Cockpit/Elynea → revue interne → validation client existante → corrections → nouvelle revue → approbation → téléchargement ; incident/reprise testés ; rollback prêt ; validation explicite de l'utilisateur avant tout déploiement et avant toute activation LIVE.

**NO-GO actuel** : configurateur et API absents en production, API de validation client absente, chaîne distante Stripe/Cockpit/production/emails non validée. La présence d'un prototype ou un healthcheck vert ne lève aucun de ces blocages. Ne pas demander une autorisation de mise en ligne commerciale comme si la recette était terminée.

## Rollback proposé, à faire approuver avec le déploiement

Cette PR ne modifie pas de schéma ni de données de production. Le rollback n'a pas été exécuté.

Avant une future recette : enregistrer les SHA des deux dépôts, ID et digest d'image, configuration sans secrets, configuration proxy/domaines, sauvegarde de base et inventaire des fichiers privés. Exporter les secrets par le gestionnaire sécurisé prévu, jamais dans une PR. Conserver l'image précédente sur le VPS et réaliser un test de restauration en environnement isolé.

Pour un futur déploiement limité à cette PR : arrêter les nouvelles prises de commande si nécessaire, repointer le service site sur l'image précédente `jsinnovia-site:ionos-canonical` par digest vérifié, sans recréer la base ni supprimer de volume. Préserver la redirection `www`, puis contrôler health, HTTPS, accueil et routes. **Cette ancienne image contient les faux succès constatés : elle sert de point de restauration technique, pas de version commercialement acceptable.** Préférer conserver la neutralisation des anciennes pages si un autre défaut impose de revenir sur les changements SEO.

Pour l'intégration commerce ultérieure : désactiver d'abord la prise de nouvelles commandes ; conserver les événements Stripe déjà reçus, les commandes, les médias et l'outbox. Ne pas effacer les clés d'idempotence et ne pas annuler des paiements ou rembourser automatiquement. Revenir sur les images compatibles avec le schéma courant ; migrations additives et compatibilité descendante à vérifier avant déploiement. Rejouer les événements seulement après réconciliation et en TEST. Retour à LIVE, changement DNS, arrêt d'un service et restauration destructive exigent une confirmation explicite.

Les sources synchronisées du projet n'ont pas été modifiées. Aucun changement n'a été appliqué à IONOS, Railway, Supabase ou Stripe.

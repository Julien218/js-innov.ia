# Registre de commercialisation JS‑Innov.IA

Ce registre est la source de vérité interne avant toute mise en vente. Un produit ne peut passer au statut `commercial-ready` que lorsque les huit portes suivantes sont explicitement validées : nom, identité, offre, juridique, sécurité, tests, facturation et déploiement.

## Décisions immuables

- HainoFlow est le logiciel autonome principal et peut être ajouté à un pack à un tarif groupé.
- Les abonnements HainoFlow 19 €, 39 € et 79 €/mois sont distincts des packs JS‑Innov.IA 790 €, 1 790 € et 2 990 € HTVA.
- FacturaPro est le module de facturation/Peppol de HainoFlow, pas un produit concurrent.
- La signature des produits autonomes est « [Produit] — by JS‑Innov.IA ».
- Une solution en marque blanche porte « Propulsé par JS‑Innov.IA », sauf exclusion prévue au contrat.
- Les partenariats ASBL, fédérations, réseaux, sponsoring et partage de revenus restent privés et hors du site public.
- « Locelya » reste uniquement un candidat interne. Le projet s’appelle provisoirement « Projet Marketing Local IA » et ne reçoit ni catalogue, domaine, Stripe, logo, bible ni document officiel.
- « WebOS », « NexusAI » et « LeadFinder Pro » ne sont pas utilisables comme marques publiques du portefeuille.

## Statut au 15 août 2026

| Produit | Modèle | Statut | Prochaine porte bloquante |
|---|---|---|---|
| HainoFlow | autonome + bundle | correction requise | sécurité, tests, juridique, Stripe et production |
| FacturaPro | module HainoFlow | interne | validation avec HainoFlow |
| Affichage dynamique | autonome + bundle | pilote bloqué | nom distinctif, secrets, CI, APK/Electron/Dropbox |
| Ville Connect OS | autonome + marque blanche | pilote | audit du nom, pilote, RGPD et modèle économique |
| Cockpit JS‑Innov.IA | infrastructure privée | interne | sécurité, isolation, CI et déploiement |
| Projet Marketing Local IA | suspendu | non officiel | validation définitive du nom |
| Moteur concours & événements | marque blanche | industrialisation | configurateur ADN, domaine et modules client |
| Moteur site intelligent | marque blanche | industrialisation | questionnaire ADN et provisionnement client |
| ADN Studio | candidat autonome | audit requis | nom, proposition de valeur, offre et tests |
| ArtisPrint AI | candidat autonome | audit requis | nom, droits des contenus et coûts |
| Voiced | candidat autonome | audit requis | nom, consentement et conformité voix |
| Assurix Voice | pilote vertical | bloqué | Twilio, fusion PR, consentement et journalisation |
| QR — by JS‑Innov.IA | module | consolidation | dépôt canonique, sécurité et offre |
| Agents IA par métier | famille de modules | cadrage | responsabilité, tests métier et confirmations |
| PDF Studio | module | cadrage | documents, stockage et données personnelles |
| Montage vidéo automatisé | module | cadrage | droits médias et coût par rendu |

## Dette technique transversale

- Les tests de commercialisation et le build Vite passent.
- Les pages secondaires sont chargées à la demande. Le bundle JavaScript initial est passé d’environ 1,94 Mo à 502 Ko avant compression ; la landing HainoFlow est isolée dans un module d’environ 11 Ko.
- Le contrôle TypeScript global du site historique échoue encore sur de nombreux composants anciens (types UI, entités et appels issus de l’ancienne architecture). Cette dette est une porte bloquante du site complet, mais elle ne remet pas en cause les tests ciblés du registre.
- Aucun produit ne doit être marqué `commercial-ready` tant que son propre dépôt n’a pas un CI vert et un audit de secrets sans alerte.

Le détail exécutable se trouve dans `src/config/commercialization.js`. Les tests empêchent qu’un produit incomplet soit marqué prêt, que Locelya devienne public ou qu’un nom retiré réapparaisse dans les sous-domaines.

### HainoFlow — preuves déjà acquises

- Bible ADN maître, landing commerciale et prix 19/39/79 € préparés.
- Price IDs Stripe test identifiés pour les trois formules.
- Checkout, portail client et webhook sont présents sur la PR commerciale.
- La validation finale reste bloquée jusqu’au déploiement de test, à la configuration sécurisée des secrets, à la rotation Base44 encore en attente et à la réussite des 22 scénarios de recette.

### Signage — preuves déjà acquises

- Offres pilote 449 € + 69 €/mois et 690 € + 129 €/mois préparées en mode test.
- Déploiement Railway staging associé à la PR Signage réussi.
- La commercialisation reste bloquée tant que le nom définitif, la rotation des secrets, les builds Player/Electron, Dropbox, le rollback et la recette de paiement ne sont pas tous validés.

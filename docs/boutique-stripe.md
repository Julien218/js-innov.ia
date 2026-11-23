# Boutique « Offres & tarifs » — paiement Stripe et facture automatique

Page publique : `/offres` (alias `/tarifs`, `/boutique`). Confirmation : `/paiement-reussi`.

## Ce qui se paie en ligne

| Offre | Prix Stripe (lookup_key) |
|---|---|
| Signelya Affichage, Packs Créa 4/10/20/30, Option Sécurité | `signelya_*_monthly` / `signelya_*_yearly` |
| Mise en service | `signelya_setup_449` (mensuel), `signelya_setup_yearly_199` (annuel), `signelya_setup_securite_241` |
| Player (mensuel uniquement, offert en annuel) | `signelya_player_49` |
| Spot vidéo supplémentaire | `signelya_spot_19` |

Studio vidéo : `studio_reseaux4_monthly`, `studio_reseaux8_monthly`, `studio_reseaux12_monthly` (mensuel) et `studio_reel_49` (unité).

Les packs de création restent **sur devis**. HainoFlow renvoie vers son application.
Pour rendre une offre payable : créer le prix dans Stripe avec une `lookup_key`, puis renseigner `checkout` dans `src/config/offers.js`. Le serveur ne crée jamais de prix à la volée.

## Circuit

1. Le visiteur choisit une offre, accepte les CGV → `POST /api/shop/checkout`.
2. Le serveur retrouve les prix Stripe par `lookup_key` et ouvre une session Checkout : adresse de facturation obligatoire, n° de TVA, TVA calculée par Stripe Tax, codes promo.
3. Stripe envoie la facture automatiquement (abonnements : à chaque échéance ; achats ponctuels : `invoice_creation`).
4. `POST /api/shop/webhook` vérifie la signature Stripe puis transmet la commande au Cockpit (`COCKPIT_ORDER_WEBHOOK_URL`), signée `x-jsinnovia-signature: t=…,v1=HMAC-SHA256(t.body)`. Si le Cockpit répond en erreur ou n'est pas encore configuré, le site répond 503/502 et Stripe relivre l'événement (jusqu'à 3 jours). Chaque commande transmise porte `payment_status` et `fulfill` : le Cockpit ne lance la production que si `fulfill` vaut `true` (un paiement différé arrive d'abord `unpaid`, puis `async_payment_succeeded`).

Événements transmis : `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`.

## Variables du serveur

```bash
STRIPE_SECRET_KEY=           # clé restreinte conseillée : Checkout Sessions (écriture), Prices (lecture), Invoices (lecture)
STRIPE_WEBHOOK_SECRET=       # endpoint https://www.jsinnovia.com/api/shop/webhook
PUBLIC_SITE_URL=https://www.jsinnovia.com
STRIPE_AUTOMATIC_TAX=true    # Stripe Tax est actif (siège : Dour, BE)
COCKPIT_ORDER_WEBHOOK_URL=   # endpoint de réception des commandes dans le Cockpit
COCKPIT_ORDER_WEBHOOK_SECRET=  # au moins 32 caractères, partagé avec le Cockpit
```

`GET /api/shop/status` indique ce qui est configuré (sans rien révéler).
Sans `STRIPE_SECRET_KEY`, la page s'affiche et le bouton répond « paiement pas encore activé ».

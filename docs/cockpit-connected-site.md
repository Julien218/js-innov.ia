# Site JS-Innov.IA connecté au cockpit

## Routes

- `/cockpit`
- `/site-cockpit`

Ces routes présentent JS-Innov.IA comme plateforme connectée au cockpit IA.

## Circuit du formulaire

Le formulaire « Créer un lead cockpit » utilise le même circuit que les autres formulaires publics :

1. case de consentement RGPD obligatoire (`PrivacyConsentNotice`) ;
2. `platform.functions.invoke('receiveLead', …)` vers `server.mjs` ;
3. enregistrement de la preuve de consentement dans le registre de gouvernance du Cockpit ;
4. création du contact dans NOVA via l'agent (`/data/Contact`) avec la clé serveur.

Aucune donnée n'est conservée dans le navigateur et aucune clé n'est exposée au front.
Un échec d'envoi est affiché au visiteur : le message de succès n'apparaît qu'après la réponse du serveur.

## Variables serveur

```bash
JSINNOVIA_AGENT_URL=
AGENT_API_KEY=
ELYNEA_SITE_KEY=
GOVERNANCE_CONSENT_URL=
```

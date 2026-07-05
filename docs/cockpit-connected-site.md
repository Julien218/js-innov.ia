# Site JS-Innov.IA connecté au cockpit

## Routes ajoutées

- `/cockpit`
- `/site-cockpit`

Ces routes affichent une page commerciale complète pour vendre JS-Innov.IA comme plateforme connectée au cockpit IA local.

## Objectif

Le site ne sert pas uniquement de vitrine. Il devient une porte d'entrée vers le cockpit :

- capture de lead ;
- qualification du besoin ;
- priorisation commerciale ;
- envoi vers webhook ou API ;
- fallback local si aucun connecteur n'est configuré.

## Variables d'environnement

Créer un fichier `.env.local` à partir de `.env.example`.

### Mode webhook

```bash
VITE_COCKPIT_WEBHOOK_URL=https://ton-webhook.make.com/xxxx
```

### Mode API cockpit

```bash
VITE_COCKPIT_API_URL=http://127.0.0.1:8787
VITE_COCKPIT_API_KEY=une-cle-publique-ou-token-proxy
```

Le client envoie par défaut vers :

```txt
POST /api/leads
```

## Payload envoyé

```json
{
  "source": "site-js-innov-ia",
  "captured_at": "ISO_DATE",
  "user_agent": "NAVIGATOR_USER_AGENT",
  "page_url": "CURRENT_PAGE_URL",
  "type": "lead_site_cockpit",
  "priority": "normal | high",
  "form": {
    "name": "",
    "email": "",
    "phone": "",
    "company": "",
    "need": "site-cockpit",
    "budget": "à définir",
    "message": ""
  }
}
```

## Sécurité

Ne jamais exposer de clé privée Supabase, OpenAI, Make ou Railway dans le front. Le site doit appeler un webhook public contrôlé ou un endpoint backend du cockpit.

## Fichiers ajoutés

- `src/lib/cockpitClient.js`
- `src/pages/CockpitConnectedSite.jsx`
- `.env.example`

## Fichier modifié

- `src/App.jsx`

# Elyna — Fondation avatar 3D

## Identité

**Elyna** est le nom officiel du personnage. **Compagnon JS-Innov.IA** est son rôle produit.

Cette évolution ne crée pas un nouvel assistant : elle fait évoluer le Compagnon existant vers une identité 3D animée, tout en conservant le chatbot public, le backend `publicChat`, les règles de sécurité et les assets WebP actuels comme fallback.

## Architecture cible

```text
Elyna Core
├─ Web / chatbot public
├─ Cockpit authentifié
├─ Voice / Realtime
├─ Desktop always-on-top
└─ Présentation / démonstration logicielle
```

Une seule identité, une seule personnalité et une seule charte visuelle doivent être réutilisées dans tous les canaux.

## Assets actuels conservés

- `/brand/companion/companion-avatar-256.webp`
- `/brand/companion/companion-launcher-256.webp`

Ils restent les fallbacks obligatoires tant que le modèle 3D n'est pas livré et validé.

## Emplacement réservé au modèle maître

Le modèle de diffusion prévu est :

`/brand/companion/elyna/elyna.vrm`

Le fichier source de création 3D ne doit pas être servi par le site. Il pourra être conservé hors bundle web sous forme de fichier Blender maître.

## États d'animation prévus

- `idle`
- `listening`
- `thinking`
- `speaking`
- `success`
- `error`

Les transitions doivent rester sobres, lentes et compatibles avec `prefers-reduced-motion`.

## Contrat du modèle 3D

Le modèle final devra fournir au minimum :

- rig humanoïde ;
- clignement des yeux ;
- regard orientable ;
- expressions neutre, attentive, réflexion et sourire ;
- morph targets / expressions nécessaires au lip-sync ;
- textures optimisées pour navigateur ;
- silhouette adulte et professionnelle ;
- ADN JS-Innov.IA bleu nuit, or, cyan et violet ;
- symbole phénix intégré sans surcharger le visage.

## Intégration progressive

### Phase 1 — identité

Le manifeste et l'interface utilisent le nom Elyna, avec le sous-titre `Compagnon JS-Innov.IA`.

### Phase 2 — renderer 3D

Ajouter Three.js + `@pixiv/three-vrm`, charger le modèle VRM uniquement lorsque `threeD.enabled` vaut `true`, et conserver l'image WebP en fallback en cas d'échec de chargement ou de WebGL indisponible.

### Phase 3 — états

Connecter l'état de l'interface au personnage :

```text
idle      -> idle
loading   -> thinking
listening -> listening
speaking  -> speaking
success   -> success
error     -> error
```

### Phase 4 — voix et lip-sync

Le lip-sync temps réel doit être piloté par l'audio de sortie. Une version plus précise pourra ensuite exploiter des visèmes.

### Phase 5 — desktop

L'application desktop du cockpit pourra afficher Elyna dans une fenêtre transparente `alwaysOnTop`, indépendante de la fenêtre principale, pour qu'elle reste visible lorsque le cockpit est réduit.

## Règle de migration

Ne pas introduire une nouvelle identité concurrente. Les références historiques techniques telles que NOVA restent séparées jusqu'à leur migration explicite ; Elyna correspond uniquement au Compagnon JS-Innov.IA existant.

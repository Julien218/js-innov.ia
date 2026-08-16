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

## Emplacement du modèle maître de diffusion

Le modèle de diffusion prévu est :

`/brand/companion/elyna/elyna.vrm`

Le fichier source de création 3D ne doit pas être servi par le site. Il pourra être conservé hors bundle web sous forme de fichier Blender maître.

## États d'animation

- `idle`
- `listening`
- `thinking`
- `speaking`
- `success`
- `error`

Les transitions doivent rester sobres, lentes et compatibles avec `prefers-reduced-motion`.

## Contrat du modèle 3D

Le modèle final doit fournir au minimum :

- un conteneur GLB glTF 2.0 valide ;
- une extension VRM `VRMC_vrm` (VRM 1.x) ou `VRM` legacy ;
- un rig humanoïde ;
- les expressions `blink` et `aa` pour le clignement et la base du lip-sync ;
- regard orientable ;
- expressions neutre, attentive, réflexion et sourire ;
- textures optimisées pour navigateur ;
- silhouette adulte et professionnelle ;
- ADN JS-Innov.IA bleu nuit, or, cyan et violet ;
- symbole phénix intégré sans surcharger le visage ;
- poids maximal de diffusion : 15 MiB.

## Garde de production

Le fichier `scripts/validate-elyna-vrm.mjs` est la porte d'activation officielle.

Commande locale :

```bash
npm run validate:elyna
```

La CI exécute cette validation avant les tests et le build. Tant que `threeD.enabled=false`, l'absence de `elyna.vrm` est acceptée et les WebP sont contrôlés. Dès qu'un modèle est présent, le validateur contrôle son en-tête GLB, glTF 2.0, l'extension VRM, le humanoid, les expressions obligatoires et le poids. Si `threeD.enabled=true` alors que le modèle manque ou est invalide, la CI échoue : aucune activation 3D cassée ne doit atteindre `main`.

## Intégration progressive

### Phase 1 — identité

Le manifeste et l'interface utilisent le nom Elyna, avec le sous-titre `Compagnon JS-Innov.IA`.

### Phase 2 — renderer 3D

Three.js + `@pixiv/three-vrm@3.5.5` sont chargés à la demande. Le modèle VRM n'est chargé que lorsque `threeD.enabled` vaut `true`. L'image WebP reste le fallback si le modèle, WebGL ou le runtime 3D est indisponible.

### Phase 3 — états

L'état de l'interface pilote le personnage :

```text
idle      -> idle
loading   -> thinking
listening -> listening
speaking  -> speaking
success   -> success
error     -> error
```

Le launcher utilise `idle`. L'en-tête du chat utilise actuellement `idle`, `thinking` et `error`. Les états `listening` et `speaking` seront utilisés par la couche Voice / Realtime ; `success` par les actions confirmées.

### Phase 4 — voix et lip-sync

Le lip-sync temps réel doit être piloté par l'audio de sortie. Une version plus précise pourra ensuite exploiter les visèmes fournis par le pipeline vocal.

### Phase 5 — desktop

L'application desktop du cockpit pourra afficher Elyna dans une fenêtre transparente `alwaysOnTop`, indépendante de la fenêtre principale, pour qu'elle reste visible lorsque le cockpit est réduit.

## Procédure d'activation finale

1. livrer `public/brand/companion/elyna/elyna.vrm` ;
2. lancer `npm run validate:elyna` ;
3. tester launcher + chat sur desktop et mobile avec `threeD.enabled=false` en chargeant le modèle dans une branche de validation ;
4. vérifier cadrage, GPU/CPU, mémoire, clignement, expression `aa`, reduced-motion et fallback WebGL ;
5. passer `threeD.enabled=true` uniquement après succès ;
6. lancer `npm test`, `npm run lint`, `npm run build` et un smoke test du site publié.

## Règle de migration

Ne pas introduire une nouvelle identité concurrente. Les références historiques techniques telles que NOVA restent séparées jusqu'à leur migration explicite ; Elyna correspond uniquement au Compagnon JS-Innov.IA existant.

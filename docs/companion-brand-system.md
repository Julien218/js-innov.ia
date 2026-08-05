# Compagnon JS-Innov.IA — système visuel premium 3D

## Positionnement

Le Compagnon JS-Innov.IA est l’assistant public officiel de la marque. Son rôle est d’incarner une intelligence artificielle haut de gamme, accessible, rassurante et immédiatement reconnaissable.

Le personnage doit toujours rester :

- mature et professionnel, jamais enfantin ;
- accueillant sans être caricatural ;
- technologique, humain et premium ;
- cohérent avec l’ADN bleu nuit, or, violet et cyan de JS-Innov.IA.

## Assets de production intégrés

| Asset | Usage | Format |
|---|---|---|
| `companion-avatar-256.webp` | En-tête du chat, réponses, profils et cartes | WebP 256 × 256 |
| `companion-launcher-256.webp` | Bouton flottant principal | WebP 256 × 256 |
| `manifest.json` | Références techniques, palette et règles minimales | JSON |

Les fichiers sont servis localement depuis `/public/brand/companion/`. Aucun hébergement externe n’est requis pour le chatbot.

## Palette officielle

- Bleu nuit : `#080B1F`
- Indigo profond : `#121A2E`
- Or signature : `#D4AF37`
- Or lumière : `#F5CF41`
- Violet innovation : `#6A00FF`
- Cyan intelligence : `#00B4FF`
- Blanc lumière : `#F5F7FA`

## Règles d’utilisation

- Taille minimale du bouton flottant : 56 px.
- Taille minimale de l’avatar dans une conversation : 32 px.
- Privilégier les fonds sombres et épurés.
- Conserver un cercle de respiration autour de l’avatar.
- Ne pas étirer, recadrer brutalement, recolorer ou inverser le personnage.
- Ne pas superposer de texte sur le visage, le casque ou l’emblème central.
- Éviter les animations rapides ou répétitives ; respecter `prefers-reduced-motion`.

## Interface chatbot

Le chatbot de production utilise :

- une fenêtre responsive plein écran sur mobile et compacte sur desktop ;
- un lanceur flottant discret avec état « en ligne » ;
- un message d’accueil affiché une seule fois ;
- des suggestions de questions pour accélérer l’entrée en conversation ;
- des états clairs : attente, réponse, erreur et nouvelle tentative ;
- une mention de confidentialité visible ;
- un contraste élevé et une navigation clavier complete.

## Séparation fonctionnelle

Le Compagnon public ne doit jamais prétendre accéder au cockpit, aux données internes ou aux actions administratives. L’assistant personnel du cockpit sera une intégration distincte, authentifiée et journalisée.

## Pack source

Les planches de conception 3D, les formats marketing, les maquettes desktop/mobile et le prompt vidéo de présentation sont conservés dans le kit source JS-Innov.IA. Les deux fichiers WebP intégrés au dépôt sont les versions optimisées pour la production web.

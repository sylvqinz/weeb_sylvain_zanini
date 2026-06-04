# Architecture

## Vue generale

L'application est organisee autour de quatre zones principales :

- `src/main.tsx` : point d'entree React.
- `src/App.tsx` : layout global et declaration des routes.
- `src/pages/` : pages associees aux routes.
- `src/lib/` : appels API et logique metier partagee.

## Demarrage React

`src/main.tsx` recupere l'element `#root`, cree la racine React, puis enveloppe l'application avec :

- `React.StrictMode`
- `BrowserRouter`
- `AuthProvider`

`AuthProvider` doit etre place au-dessus de `App`, car les routes, le header et les pages utilisent `useAuth()`.

## Layout global

`src/App.tsx` affiche :

- `ScrollTop`
- `Header`
- le contenu principal dans `<main>`
- `Footer`

Les routes sont placees dans `ProtectedRoute`, qui decide si une page est publique, protegee ou reservee aux visiteurs non connectes.

## Separation des responsabilites

- Les composants UI reutilisables sont dans `src/components/`.
- Les pages sont dans `src/pages/`.
- Les hooks personnalisés sont dans `src/hooks/`.
- La logique d'API est dans `src/lib/`.
- Le contexte d'authentification est dans `src/context/`.

## Convention auth

Le dossier `src/context/` contient deux fichiers :

- `auth-context.ts` : definit le contexte brut et ses types.
- `AuthProvider.tsx` : contient le composant React qui gere l'etat d'authentification.

Cette separation evite de melanger un composant React avec des exports non composants, ce qui aide avec Fast Refresh et ESLint.


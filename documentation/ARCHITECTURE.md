# Architecture

## Vue generale

L'application est organisee autour de cinq zones principales :

- `src/main.tsx` : point d'entree React.
- `src/App.tsx` : composition du layout global et des routes.
- `src/routes/` : declaration des routes et regles d'acces.
- `src/pages/` : pages associees aux routes.
- `src/lib/` : appels API et logique metier partagee.

## Demarrage React

`src/main.tsx` recupere l'element `#root`, cree la racine React, puis enveloppe l'application avec :

- `React.StrictMode`
- `BrowserRouter`
- `AuthProvider`

`AuthProvider` doit etre place au-dessus de `App`, car les routes, le header et les pages utilisent `useAuth()`.

## Layout global

`src/components/Layout.tsx` affiche :

- `ScrollToTop`
- `Header`
- le contenu principal dans `<main>`
- `Footer`

`src/App.tsx` compose ce layout avec `src/routes/AppRoutes.tsx`.

Les routes sont placees dans `ProtectedRoute`, qui decide si une page est publique, protegee ou reservee aux visiteurs non connectes. Les regles d'acces sont declarees dans `src/routes/routeAccess.ts`.

## Separation des responsabilites

- Les composants UI reutilisables sont dans `src/components/`.
- Les routes et leurs regles d'acces sont dans `src/routes/`.
- Les pages sont dans `src/pages/`.
- Les hooks personnalisés sont dans `src/hooks/`.
- La logique d'API est dans `src/lib/`.
- Le contexte d'authentification est dans `src/context/`.

## Convention auth

Le dossier `src/context/` contient deux fichiers :

- `auth-context.ts` : definit le contexte brut et ses types.
- `AuthProvider.tsx` : contient le composant React qui gere l'etat d'authentification.

Cette separation evite de melanger un composant React avec des exports non composants, ce qui aide avec Fast Refresh et ESLint.

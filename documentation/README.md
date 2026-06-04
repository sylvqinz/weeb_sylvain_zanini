# Documentation Frontend Weeb

Ce dossier documente le code frontend du projet Weeb.

Le frontend est une application React + TypeScript construite avec Vite, Tailwind CSS, React Router et Axios. Il consomme une API backend via `VITE_API_URL` ou, par defaut, `http://localhost:8000/api`.

## Fichiers de documentation

- `SETUP.md` : installation, scripts et lancement du projet.
- `ARCHITECTURE.md` : organisation generale de l'application.
- `ROUTING.md` : routes React et protections.
- `API_CLIENT.md` : configuration Axios, tokens et erreurs.
- `AUTH.md` : connexion, inscription, session et reset password.
- `ARTICLES.md` : blog, detail, creation, edition et suppression.
- `ADMIN.md` : tableau de bord administrateur.
- `ACCOUNT.md` : page compte utilisateur.
- `CONTACT.md` : formulaire de contact.
- `COMPONENTS.md` : composants reutilisables.
- `HOOKS.md` : hooks personnalises.
- `ENVIRONMENT.md` : variables d'environnement.
- `STYLES_ASSETS.md` : styles globaux et assets publics.
- `ERROR_HANDLING.md` : gestion des erreurs cote front.
- `FILE_STRUCTURE.md` : role des principaux fichiers.

## Point d'entree

Le rendu React demarre dans `src/main.tsx`. L'application est enveloppee par `BrowserRouter` et `AuthProvider`, puis `App.tsx` declare les routes principales.


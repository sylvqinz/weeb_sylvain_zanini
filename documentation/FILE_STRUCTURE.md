# Structure Des Fichiers

## Racine

- `index.html` : page HTML utilisee par Vite.
- `package.json` : dependances et scripts.
- `vite.config.ts` : configuration Vite, React et Tailwind.
- `eslint.config.js` : configuration ESLint.
- `tsconfig*.json` : configuration TypeScript.

## `src/`

- `main.tsx` : montage de React.
- `App.tsx` : composition du layout global et des routes.
- `index.css` : styles globaux et import Tailwind.
- `vite-env.d.ts` : types Vite.

## `src/components/`

- `Header.tsx` : navigation desktop/mobile et deconnexion.
- `Footer.tsx` : pied de page.
- `Button.tsx` : bouton reutilisable pour actions et liens-boutons.
- `TextField.tsx` : champ de formulaire reutilisable.
- `ConfirmDialog.tsx` : modale de confirmation reutilisable.
- `Layout.tsx` : structure commune de l'application.
- `ProtectedRoute.tsx` : protection generale des routes.
- `AdminRoute.tsx` : protection admin.
- `ScrollToTop.tsx` : retour en haut lors du changement de route.

## `src/routes/`

- `AppRoutes.tsx` : declaration des routes React.
- `routeAccess.ts` : regles d'acces utilisees par `ProtectedRoute`.

## `src/context/`

- `auth-context.ts` : types et `AuthContext`.
- `AuthProvider.tsx` : etat de session, login, register, logout, refresh.

## `src/hooks/`

- `useAuth.ts` : acces au contexte d'authentification.
- `useConfirmDialog.tsx` : orchestration des confirmations modales.
- `useObserver.ts` : detection de visibilite avec `IntersectionObserver`.
- `useScroll.ts` : progression de scroll d'une section.

## `src/lib/`

- `api.ts` : client Axios centralise.
- `auth.ts` : appels auth et helpers utilisateur.
- `articles.ts` : CRUD articles.
- `articleOwnership.ts` : droits de gestion des articles.
- `display.ts` : helpers de formatage pour l'affichage.
- `admin.ts` : appels API admin.
- `contact.ts` : envoi du formulaire de contact.

## `src/pages/`

- `Home.tsx` : page d'accueil.
- `Blog.tsx` : liste des articles.
- `BlogDetail.tsx` : detail d'un article.
- `CreateArticle.tsx` : creation et edition d'article.
- `Login.tsx` : connexion.
- `Signup.tsx` : inscription.
- `ResetPassword.tsx` : demande et confirmation de reset password.
- `Account.tsx` : espace utilisateur.
- `AccountSettings.tsx` : parametres du compte, profil, mot de passe et 2FA.
- `ConfirmEmailChange.tsx` : confirmation du changement d'email depuis le lien recu.
- `AdminDashboard.tsx` : administration.
- `Contact.tsx` : formulaire de contact.
- `NotFound.tsx` : page 404.

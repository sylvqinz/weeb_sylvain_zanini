# Composants

## `Header`

Fichier : `src/components/Header.tsx`

Role :

- afficher la navigation principale ;
- gerer le menu mobile ;
- masquer le header quand l'utilisateur descend dans la page ;
- afficher des liens differents selon la session ;
- gerer la deconnexion.

Liens principaux :

- `/`
- `/blog`
- `/contact`
- `/login`
- `/signup`
- `/account`
- `/admin` si l'utilisateur est admin.

La deconnexion appelle `logout()` depuis `useAuth`, ferme le menu mobile, puis redirige vers `/login`.

## `Footer`

Fichier : `src/components/Footer.tsx`

Role :

- afficher des colonnes de liens ;
- afficher les icones de reseaux sociaux avec `react-icons/fa`.

Attention : plusieurs liens du footer ne sont pas encore declares comme routes dans `App.tsx`.

## `ProtectedRoute`

Fichier : `src/components/ProtectedRoute.tsx`

Role :

- autoriser les routes publiques ;
- rediriger les utilisateurs non connectes vers `/login` pour les routes privees ;
- rediriger un utilisateur connecte hors de `/login` et `/signup`.

## `AdminRoute`

Fichier : `src/components/AdminRoute.tsx`

Role :

- reserver une page aux utilisateurs admin ;
- rediriger vers `/login` si l'utilisateur n'est pas connecte ;
- afficher `Accès réservé` si l'utilisateur n'est pas admin.

## `ScrollTop`

Fichier : `src/components/scrollTop.tsx`

Role :

- ecouter le changement de `pathname` ;
- replacer la fenetre en haut de page avec `window.scrollTo(0, 0)`.


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

Attention : plusieurs liens du footer ne sont pas encore declares comme routes dans `src/routes/AppRoutes.tsx`.

## `Button`

Fichier : `src/components/Button.tsx`

Role :

- centraliser les styles de boutons et liens-boutons ;
- exposer des variantes visuelles (`primary`, `secondary`, `danger`, `dangerOutline`, `gradient`, `heroGradient`, `whiteOutline`) ;
- gerer les tailles communes (`sm`, `md`, `lg`).

## `TextField`

Fichier : `src/components/TextField.tsx`

Role :

- centraliser les styles de champs de formulaire ;
- rendre un `input` ou un `textarea` selon le besoin ;
- exposer les variantes `underline` et `panel`.

## `ConfirmDialog`

Fichier : `src/components/ConfirmDialog.tsx`

Role :

- afficher une confirmation modale reutilisable ;
- remplacer les confirmations natives pour les actions destructives.

## `Layout`

Fichier : `src/components/Layout.tsx`

Role :

- afficher la structure commune de l'application ;
- monter `ScrollToTop`, `Header`, le contenu principal et `Footer`.

## `ProtectedRoute`

Fichier : `src/components/ProtectedRoute.tsx`

Role :

- autoriser les routes publiques ;
- rediriger les utilisateurs non connectes vers `/login` pour les routes privees ;
- rediriger un utilisateur connecte hors de `/login` et `/signup`.

La route `/confirm-email-change` est publique pour permettre l'ouverture du
lien envoye par email avant ou apres connexion.

## `TwoFactorSettings`

Fichier : `src/components/TwoFactorSettings.tsx`

Role :

- afficher l'etat de la double authentification ;
- initialiser la configuration TOTP ;
- afficher le QR code et la cle manuelle ;
- confirmer l'activation avec un code a six chiffres ;
- desactiver la 2FA avec un code TOTP.

Le composant est affiche dans `src/pages/AccountSettings.tsx`.

## `AdminRoute`

Fichier : `src/components/AdminRoute.tsx`

Role :

- reserver une page aux utilisateurs admin ;
- rediriger vers `/login` si l'utilisateur n'est pas connecte ;
- afficher `Accès réservé` si l'utilisateur n'est pas admin.

## `ScrollToTop`

Fichier : `src/components/ScrollToTop.tsx`

Role :

- ecouter le changement de `pathname` ;
- replacer la fenetre en haut de page avec `window.scrollTo(0, 0)`.

# Routing

## Routeur

Le routeur est fourni par `BrowserRouter` dans `src/main.tsx`.

Les routes sont declarees dans `src/App.tsx` avec `Routes` et `Route` de `react-router-dom`.

## Routes principales

| Chemin | Page | Acces |
| --- | --- | --- |
| `/` | `Home` | public |
| `/contact` | `Contact` | public |
| `/login` | `Login` | invite uniquement |
| `/signup` | `Signup` | invite uniquement |
| `/confirm-email-change` | `ConfirmEmailChange` | public |
| `/blog` | `Blog` | public |
| `/blog/:slug` | `BlogDetail` | public |
| `/articles/new` | `CreateArticle` | connecte |
| `/articles/:slug/edit` | `CreateArticle` | connecte |
| `/account` | `Account` | connecte |
| `/account/settings` | `AccountSettings` | connecte |
| `/admin` | `AdminDashboard` | admin |
| `/reset-password` | `ResetPassword` | public |
| `*` | `NotFound` | public |

## `ProtectedRoute`

`ProtectedRoute` englobe toutes les routes dans `App.tsx`.

Il contient deux listes :

- `publicRoutes` : pages accessibles sans connexion.
- `guestOnlyRoutes` : pages reservees aux utilisateurs non connectes.

Comportement :

- Si une route protegee est demandee sans session, l'utilisateur est redirige vers `/login`.
- Si `/login` ou `/signup` est demande par un utilisateur connecte, il est redirige vers `/`.
- Pendant la verification de session, un message temporaire est affiche.

## `AdminRoute`

`AdminRoute` protege uniquement `/admin`.

Il verifie :

- que la session n'est plus en verification ;
- que l'utilisateur est authentifie ;
- que `isAdminUser(user)` retourne `true`.

Dans ce projet, `isAdminUser` considere admin uniquement un utilisateur avec `is_staff === true`.

## Routes mentionnees mais non declarees

Certaines URLs apparaissent dans le footer ou la homepage, mais ne sont pas declarees dans `App.tsx`, par exemple :

- `/pricing`
- `/overview`
- `/browse`
- `/subscribe`
- `/ressources`
- `/news`

Ces liens tomberont actuellement sur la page 404 tant que les routes correspondantes ne sont pas creees.

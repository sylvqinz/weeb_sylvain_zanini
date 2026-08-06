# Administration

L'administration repose sur :

- `src/components/AdminRoute.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/lib/admin.ts`
- `src/lib/articles.ts`
- `src/lib/articleOwnership.ts`

## Acces admin

La route `/admin` est protegee par `AdminRoute`.

Pour acceder au dashboard, l'utilisateur doit :

- etre authentifie ;
- avoir `is_staff === true`.

Si l'utilisateur n'est pas connecte, il est redirige vers `/login`.

Si l'utilisateur est connecte mais pas admin, une section `Accès réservé` est affichee.

## Donnees chargees

Au montage, `AdminDashboard` charge :

- les articles avec `fetchArticles()`;
- les utilisateurs avec `fetchAdminUsers()`.

Le dashboard affiche trois compteurs :

- nombre de publications ;
- nombre d'utilisateurs ;
- nombre d'utilisateurs a valider.

## Onglets

Le dashboard contient deux onglets :

- `Publications`
- `Utilisateurs`

L'onglet actif est stocke dans l'etat local `activeTab`.

## Gestion des articles

Dans l'onglet publications, chaque article peut afficher :

- `Voir`
- `Modifier`
- `Supprimer`

Les actions de modification et suppression sont visibles seulement si `canManageArticle(article, currentUser)` retourne `true`.

La suppression demande une confirmation avec `ConfirmDialog`.

## Gestion des utilisateurs

Les utilisateurs sont recuperes via :

```txt
GET /admin/users/
```

Le code accepte plusieurs formats de reponse :

- tableau direct ;
- `{ results: [...] }`
- `{ users: [...] }`
- `{ data: [...] }`

## Validation et desactivation

Pour valider un utilisateur :

```txt
PATCH /admin/users/:userId/
{ "is_active": true }
```

Pour desactiver un utilisateur :

```txt
PATCH /admin/users/:userId/
{ "is_active": false }
```

Le bouton est desactive pour les comptes staff afin d'eviter de modifier un admin depuis cette interface.

# Compte Utilisateur

La page compte est definie dans `src/pages/Account.tsx`.

## Acces

La route `/account` est protegee par `ProtectedRoute`.

Un utilisateur non connecte est redirige vers `/login`.

## Donnees affichees

La page affiche :

- le nom de l'utilisateur ;
- son email ;
- le nombre de publications associees ;
- la liste de ses articles.

## Identification de l'utilisateur

Le nom est construit avec :

1. `first_name` + `last_name`
2. `username`
3. `email`
4. `Utilisateur`

Cette logique est dans `getUserName`.

## Articles personnels

La page charge tous les articles avec `fetchArticles()`, puis filtre ceux de l'utilisateur courant avec :

```ts
isCurrentUserArticle(article, user)
```

Cette fonction compare plusieurs champs d'identite pour etre compatible avec plusieurs formes de backend.

## Actions

Pour chaque article personnel, l'utilisateur peut :

- voir l'article ;
- modifier l'article ;
- supprimer l'article.

La suppression utilise :

```txt
DELETE /articles/:slug/
```

et retire ensuite l'article de l'etat local.


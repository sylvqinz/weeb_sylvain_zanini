# Compte Utilisateur

La page compte est definie dans `src/pages/Account.tsx`.

## Acces

La route `/account` est protegee par `ProtectedRoute`.

Un utilisateur non connecte est redirige vers `/login`.

## Donnees affichees

La page affiche :

- le nom de l'utilisateur ;
- son email ;
- le nombre de ses articles et de ses favoris ;
- la liste de ses articles ;
- la liste de ses favoris.

## Identification de l'utilisateur

Le nom est construit avec :

1. `first_name` + `last_name`
2. `username`
3. `email`
4. `Utilisateur`

Cette logique est dans `getUserName`.

## Articles personnels et favoris

La page charge directement les deux listes avec les routes authentifiees :

```txt
GET /users/me/articles/
GET /users/me/favorites/
```

Le client API ajoute automatiquement l'en-tete suivant a ces requetes :

```txt
Authorization: Bearer <access_token>
```

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

Les cartes des deux listes permettent egalement d'ajouter ou de retirer un
favori. La reponse remplace localement `is_favorite` et `favorites_count` ; un
article retire des favoris disparait immediatement de la liste correspondante.

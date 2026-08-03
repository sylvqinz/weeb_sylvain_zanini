# Articles Et Blog

La fonctionnalite blog repose sur :

- `src/lib/articles.ts`
- `src/lib/articleOwnership.ts`
- `src/pages/Blog.tsx`
- `src/pages/BlogDetail.tsx`
- `src/pages/CreateArticle.tsx`
- `src/pages/Account.tsx`
- `src/pages/AdminDashboard.tsx`

## Type `Article`

Le type `Article` accepte plusieurs formats possibles venant du backend :

- `title`
- `content`
- `body`
- `slug`
- `excerpt`
- `created_at`
- `updated_at`
- `is_favorite`
- `favorites_count`
- `author`

Le champ `author` peut etre une chaine ou un objet utilisateur.

## Endpoints

| Action | Methode | Endpoint |
| --- | --- | --- |
| Liste | `GET` | `/articles/` |
| Detail | `GET` | `/articles/:slug/` |
| Creation | `POST` | `/articles/` |
| Edition complete | `PUT` | `/articles/:slug/` |
| Edition partielle | `PATCH` | `/articles/:slug/` |
| Suppression | `DELETE` | `/articles/:slug/` |
| Ajouter aux favoris | `POST` | `/articles/:slug/favorite/` |
| Retirer des favoris | `DELETE` | `/articles/:slug/favorite/` |

## Page Blog

`Blog.tsx` charge la liste des articles au montage avec `fetchArticles()`.

Elle affiche :

- un etat de chargement ;
- un message d'erreur si l'API echoue ;
- un message si aucun article n'existe ;
- une carte par article.

Si l'utilisateur est connecte, un bouton `Créer un article` apparait.

Chaque carte utilise `is_favorite` et `favorites_count`. Le bouton appelle la
route d'ajout ou de retrait selon la valeur de `is_favorite`, puis remplace ces
deux champs localement avec la reponse de l'API.

## Detail d'article

`BlogDetail.tsx` lit le `slug` depuis l'URL.

Elle charge l'article avec `fetchArticle(slug)`.

Elle affiche :

- titre ;
- auteur ;
- date de creation ;
- contenu ;
- liens de retour.

Si l'utilisateur peut gerer l'article, elle affiche aussi :

- `Modifier`
- `Supprimer`

Le detail expose le meme bouton de favori et la meme mise a jour locale que les
cartes de la liste.

## Creation et edition

`CreateArticle.tsx` sert pour deux routes :

- `/articles/new`
- `/articles/:slug/edit`

Si `slug` existe, la page passe en mode edition et charge l'article existant.

Au submit :

- sans `slug`, elle appelle `createArticle(payload)` ;
- avec `slug`, elle appelle `updateArticle(slug, payload)`.

Apres succes, l'utilisateur est redirige vers l'article si un slug est disponible, sinon vers `/blog`.

## Droits sur les articles

`articleOwnership.ts` compare l'utilisateur courant avec les informations de l'article.

Il teste plusieurs champs pour rester compatible avec differents formats backend :

- cote user : `id`, `user_id`, `sub`, `username`, `email` ;
- cote article : `author`, `author_id`, `user_id`, `owner_id`, `user`, `owner`, `created_by`.

`canManageArticle(article, user)` retourne `true` si :

- l'utilisateur est actif ;
- et il est admin ou proprietaire de l'article.

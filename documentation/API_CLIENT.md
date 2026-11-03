# Client API

Le client API principal est defini dans `src/lib/api.ts`.

## URL de base

```ts
export const API_URL = import.meta.env.VITE_API_URL;
```

`VITE_API_URL` doit etre definie au build et pointer vers la racine du backend.
En staging : `https://weeb-backend-staging.onrender.com`, sans suffixe `/api`.

## Instance Axios

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

`withCredentials: true` permet d'envoyer les cookies avec les requetes. C'est important pour le refresh token si le backend le stocke dans un cookie HTTP-only.

## Access token

Le token d'acces est stocke dans `sessionStorage` sous la cle `access`.

Fonctions associees :

- `getAccessToken()`
- `setAccessToken(token)`
- `clearAccessToken()`

## Intercepteur de requete

Avant chaque requete, l'intercepteur lit `sessionStorage.access`.

Si un token existe et que la requete ne desactive pas le renouvellement automatique, il ajoute :

```txt
Authorization: Bearer <token>
```

## Intercepteur de reponse

Si une requete protegee retourne `401`, le client tente de rafraichir le token via :

```txt
POST /users/token/refresh/
```

Les routes login, logout et token/refresh ainsi que les appels publics sont
exclus du renouvellement automatique. Le refresh utilise `withCredentials: true`
et lit le nouveau token dans `response.data.access`.

Si le refresh fonctionne :

- le nouveau token est stocke dans `sessionStorage.access` ;
- le header `Authorization` est remplace ;
- la requete originale est relancee une seule fois, avec le marqueur `_retry`.

Un nouveau `401` sur la requete rejouee est transmis a l'appelant sans boucle
ni redirection. Les erreurs autres que `401` ne declenchent pas de refresh.

Les refresh concurrents partagent la meme promesse interne pour eviter de declencher plusieurs appels simultanes.
Un `401` tardif utilise le token deja renouvele si celui de la requete initiale
est different du token courant.

Si le refresh echoue :

- le token local est supprime ;
- l'utilisateur est redirige une seule fois vers `/login` pour les requetes protegees.

Une tentative de restauration de session anonyme au chargement qui echoue ne
redirige pas a elle seule vers la connexion.

## `publicPost`

`publicPost` utilise l'instance Axios commune avec `withCredentials: true`.
Il desactive l'ajout du token et le renouvellement automatique pour les appels publics.
Le renouvellement du token utilise egalement cette instance, sans relancer de
renouvellement sur son propre echec, afin d'eviter une boucle.

Il est utilise pour les endpoints publics comme :

- login ;
- register ;
- password reset request ;
- password reset confirm ;
- confirmation de changement d'email.

## `request`

`request<T>(path, config)` est le wrapper principal pour les appels API authentifies ou standards.

Il retourne directement `response.data`.

En cas d'erreur Axios, il transforme la reponse backend en message lisible avec `formatErrorMessage`.

Les erreurs sont representees par `ApiError`, qui conserve aussi le code metier
du backend. `isApiErrorCode` permet notamment de distinguer
`INVALID_TWO_FACTOR_CODE` et `TWO_FACTOR_TOKEN_EXPIRED` dans l'interface.

`ApiError` conserve egalement `details` quand le backend renvoie une liste dans
`details`. Ce champ est utilise pour afficher les messages de `WEAK_PASSWORD`
sous le champ de nouveau mot de passe.

## Endpoints compte

Le client auth expose notamment :

```txt
PATCH /users/
POST /users/email-change/confirm/
```

`PATCH /users/` est utilise pour les modifications de profil et de mot de
passe.

`POST /users/email-change/confirm/` est appele depuis
`/confirm-email-change?token=...` avec :

```json
{
  "token": "...",
  "current_password": "MotDePasseActuel123!"
}
```

# Client API

Le client API principal est defini dans `src/lib/api.ts`.

## URL de base

```ts
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");
```

Si `VITE_API_URL` n'est pas definie, le frontend utilise `http://localhost:8000/api`.

La methode `replace(/\/+$/, "")` supprime les slashs en fin d'URL pour eviter les doubles slashs lors de la concatenation des chemins.

## Instance Axios

```ts
export const api = axios.create({
  baseURL: API_URL,
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

Si un token existe, il ajoute :

```txt
Authorization: Bearer <token>
```

## Intercepteur de reponse

Si une reponse retourne `401`, le client tente une seule fois de rafraichir le token via :

```txt
POST /users/token/refresh/
```

Si le refresh fonctionne :

- le nouveau token est stocke ;
- la requete originale est relancee.

Si le refresh echoue :

- le token local est supprime ;
- l'utilisateur est redirige vers `/login`.

## `publicPost`

`publicPost` utilise `axios.post` directement, sans passer par l'intercepteur authentifie.

Il est utilise pour les endpoints publics comme :

- login ;
- register ;
- password reset request ;
- password reset confirm.

## `request`

`request<T>(path, config)` est le wrapper principal pour les appels API authentifies ou standards.

Il retourne directement `response.data`.

En cas d'erreur Axios, il transforme la reponse backend en message lisible avec `formatErrorMessage`.

Les erreurs sont representees par `ApiError`, qui conserve aussi le code metier
du backend. `isApiErrorCode` permet notamment de distinguer
`INVALID_TWO_FACTOR_CODE` et `TWO_FACTOR_TOKEN_EXPIRED` dans l'interface.

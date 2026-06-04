# Authentification

L'authentification est geree par :

- `src/lib/auth.ts`
- `src/context/auth-context.ts`
- `src/context/AuthProvider.tsx`
- `src/hooks/useAuth.ts`
- les pages `Login`, `Signup` et `ResetPassword`

## Types principaux

`LoginPayload` :

```ts
{
  email: string;
  password: string;
}
```

`RegisterPayload` :

```ts
{
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}
```

`AuthUser` est volontairement souple. Il accepte plusieurs champs possibles renvoyes par le backend :

- `id`
- `user_id`
- `sub`
- `username`
- `email`
- `first_name`
- `last_name`
- `is_staff`
- `is_superuser`
- `is_admin`
- `is_active`
- `role`

## Stockage de session

Le frontend stocke seulement l'access token dans `sessionStorage`.

Le refresh token n'est pas manipule directement par le front. Le code suppose qu'il peut etre envoye automatiquement via cookie grace a `withCredentials: true`.

## Login

La fonction `login(payload)` appelle :

```txt
POST /users/login/
```

Elle extrait le token depuis `access` ou `access_token`, puis le stocke localement.

Ensuite elle tente de recuperer l'utilisateur courant avec :

```txt
GET /users/
```

Si cet appel echoue, elle utilise les claims contenus dans le JWT.

## Register

La fonction `register(payload)` appelle :

```txt
POST /users/register/
```

Si le backend renvoie un token, l'utilisateur est connecte automatiquement.

Si aucun token n'est renvoye, la fonction retourne `null` et la page `Signup` redirige vers `/login`.

## Refresh session

La fonction `refreshAccessToken()` appelle :

```txt
POST /users/token/refresh/
```

Si un nouveau token est renvoye, il est stocke dans `sessionStorage`.

Si le refresh echoue, le token local est supprime.

## AuthProvider

`AuthProvider` expose via contexte :

- `authenticated`
- `checking`
- `user`
- `login`
- `register`
- `logout`
- `refreshSession`

Au montage, il initialise la session :

- si un access token existe, il essaye de charger `/users/` ;
- sinon, il tente un refresh token ;
- quand la verification est terminee, `checking` passe a `false`.

## useAuth

`useAuth()` lit le contexte d'authentification.

Si le hook est utilise hors de `AuthProvider`, il lance une erreur :

```txt
useAuth must be used inside AuthProvider.
```

## Reset Password

La page `ResetPassword` a deux modes :

- sans query params : demande d'email ;
- avec `uidb64` et `token` : confirmation du nouveau mot de passe.

Endpoints utilises :

```txt
POST /users/password-reset/request/
POST /users/password-reset/confirm/
```

## Logout

La fonction `logout()` appelle :

```txt
POST /users/logout/
```

Puis elle supprime toujours le token local, meme si le backend ne repond pas.


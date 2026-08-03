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
- `is_two_factor_enabled`
- `role`

## Stockage de session

Le frontend stocke seulement l'access token dans `sessionStorage`.

Le refresh token n'est pas manipule directement par le front. Le code suppose qu'il peut etre envoye automatiquement via cookie grace a `withCredentials: true`.

## Login

La fonction `login(payload)` appelle :

```txt
POST /users/login/
```

Sans 2FA, elle extrait le token depuis `access` ou `access_token`, puis le stocke localement.

Ensuite elle tente de recuperer l'utilisateur courant avec :

```txt
GET /users/
```

Si cet appel echoue, elle utilise les claims contenus dans le JWT.

Si la reponse contient `requires_2fa: true`, aucun access token n'est stocke et
l'utilisateur n'est pas encore connecte. La page conserve uniquement le
`two_factor_token` en memoire et demande un code a six chiffres, puis appelle :

```txt
POST /users/2fa/verify-login/
```

`INVALID_TWO_FACTOR_CODE` garde cet ecran ouvert. `TWO_FACTOR_TOKEN_EXPIRED`
supprime le jeton temporaire et renvoie vers le formulaire email/mot de passe.

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
- `verifyTwoFactorLogin`
- `register`
- `setupTwoFactor`
- `confirmTwoFactor`
- `disableTwoFactor`
- `logout`
- `refreshSession`

Au montage, il initialise la session :

- si un access token existe, il essaye de charger `/users/` ;
- sinon, il tente un refresh token ;
- quand la verification est terminee, `checking` passe a `false`.

## Double authentification TOTP

L'etat courant vient du champ `is_two_factor_enabled` renvoye par :

```txt
GET /users/
```

Depuis le profil, l'activation utilise successivement :

```txt
POST /users/2fa/setup/
POST /users/2fa/confirm/
```

Le composant `TwoFactorSettings` transforme directement `provisioning_uri` en
QR code avec `react-qr-code`, affiche egalement `secret`, puis demande le code
TOTP. La desactivation appelle :

```txt
POST /users/2fa/disable/
```

Apres confirmation ou desactivation, `AuthProvider` met a jour localement
`user.is_two_factor_enabled`.

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

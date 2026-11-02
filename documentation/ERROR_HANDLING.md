# Gestion Des Erreurs

## Centralisation dans `api.ts`

La fonction `formatErrorMessage(data)` transforme les reponses backend en message texte.

Elle gere plusieurs formats :

- `detail`
- `details`
- `message`
- `error`
- tableaux de messages ;
- objet `errors` imbrique ;
- champs multiples comme `{ email: ["..."], password: ["..."] }`.

`ApiError` conserve aussi :

- `code` pour les codes metier comme `INVALID_CURRENT_PASSWORD` ;
- `details` quand le backend renvoie une liste de messages, notamment pour
  `WEAK_PASSWORD`.

## `publicPost`

Pour les requetes publiques, `publicPost` gere :

- absence de reponse serveur ;
- erreur Axios avec reponse backend ;
- autres erreurs JavaScript.

Message fallback :

```txt
Impossible de contacter le serveur.
```

## `request`

Pour les requetes via le client Axios principal, `request` relance une `Error` contenant le message formate.

Les pages peuvent donc afficher simplement :

```ts
error instanceof Error ? error.message : "Message fallback"
```

## Etats locaux dans les pages

Les pages utilisent souvent trois types d'etats :

- `loading` pour bloquer ou afficher un chargement ;
- `message` pour afficher une erreur ou un succes ;
- un etat specifique d'action comme `deleting`, `deletingSlug`, `updatingUserId`.

## Refresh token et erreurs 401

L'intercepteur Axios detecte les `401`.

Il tente un refresh token une seule fois avec `_retry`.

Si le refresh echoue :

- le token local est supprime ;
- l'utilisateur est redirige vers `/login`.

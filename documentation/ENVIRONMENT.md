# Environnement

## Variable principale

Le frontend utilise :

```txt
VITE_API_URL
```

Cette variable doit pointer vers l'API backend.

Exemple :

```txt
VITE_API_URL=https://weeb-backend-staging.onrender.com
```

## Configuration locale et deploiement

`VITE_API_URL` doit etre definie au moment du build. `.env.production` configure
l'URL de staging Render ; une variable definie dans Vercel est prioritaire.
Pour utiliser un backend local :

```txt
http://localhost:8000
```

Apres une modification de cette variable, redemarrer Vite en developpement ou
reconstruire et redeployer le frontend en ligne.

## Pourquoi le prefixe `VITE_`

Avec Vite, seules les variables d'environnement prefixees par `VITE_` sont exposees au code frontend via `import.meta.env`.

## Cookies et CORS

Le client Axios utilise :

```ts
withCredentials: true
```

Le backend doit donc autoriser les credentials CORS si le front et le back ne sont pas sur la meme origine.

Points a verifier cote backend :

- origine du frontend autorisee ;
- credentials autorises ;
- cookies compatibles avec l'environnement local ou production.


## Prefixes des routes

`VITE_API_URL` doit pointer vers la racine du backend, sans suffixe `/api`.
Les appels utilisateurs, articles et contact utilisent directement cette base.
Seuls les appels administrateurs ajoutent `/api/admin/` dans leur chemin.

## URL publique du frontend

Le frontend est heberge sur https://weeb-kappa.vercel.app/.
Le backend doit autoriser exactement l'origine `https://weeb-kappa.vercel.app`
dans sa configuration CORS avec credentials. Les liens de confirmation de
changement d'email utilisent `/confirm-email-change` sur ce frontend.
Les emails de reset password renvoient vers la page HTML commune du backend.

Le workflow GitHub Actions execute le lint et le build. Le deploiement est gere
par Vercel selon la configuration du projet Vercel.

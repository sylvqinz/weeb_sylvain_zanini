# Environnement

## Variable principale

Le frontend utilise :

```txt
VITE_API_URL
```

Cette variable doit pointer vers l'API backend.

Exemple :

```txt
VITE_API_URL=http://localhost:8000
```

## Valeur par defaut

Si `VITE_API_URL` n'est pas definie, `src/lib/api.ts` utilise :

```txt
http://localhost:8000
```

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

# Setup

## Stack technique

- React `19`
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- React Icons

## Scripts npm

Le fichier `package.json` expose ces scripts :

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Lancer le projet

1. Installer les dependances :

```bash
npm install
```

2. Configurer l'URL de l'API si besoin dans `.env` :

```txt
VITE_API_URL=http://localhost:8000/api
```

3. Demarrer le serveur Vite :

```bash
npm run dev
```

## Verification

Le lint se lance avec :

```bash
npm run lint
```

Le build de production se lance avec :

```bash
npm run build
```

Le build execute d'abord `tsc -b`, puis `vite build`.


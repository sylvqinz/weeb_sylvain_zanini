# Styles Et Assets

## Tailwind CSS

Le projet importe Tailwind dans `src/index.css` :

```css
@import "tailwindcss";
```

Le plugin Tailwind est aussi ajoute dans `vite.config.ts`.

## Theme global

`src/index.css` definit une police globale dans le theme :

```css
@theme {
  --font-sans: "roboto", sans-serif;
}
```

## Styles globaux

Le fichier applique aussi :

- `padding-top: 50px` sur toutes les sections ;
- `font-size: 72px` sur tous les `h1` ;
- `font-size: 18px` sur tous les `p`.

Ces styles globaux peuvent impacter toutes les pages, meme quand les composants utilisent des classes Tailwind.

## Couleurs principales

L'interface utilise beaucoup :

- fond bleu tres sombre `#0f172a` ;
- panneaux `#19202f` et `#20223f` ;
- accents violets Tailwind (`purple-300`, `purple-400`, `purple-600`, etc.).

## Assets publics

Les images et logos sont dans `public/assets/`.

Assets utilises par la homepage :

- `Desktop.jpg`
- `smartFinder_logo.svg`
- `zoomer_logo.svg`
- `shells_logo.svg`
- `waves_logo.svg`
- `artVenue_logo.svg`

Ces assets sont accessibles dans le code via des chemins comme :

```txt
/assets/Desktop.jpg
```


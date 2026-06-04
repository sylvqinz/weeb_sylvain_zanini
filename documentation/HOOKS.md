# Hooks

## `useAuth`

Fichier : `src/hooks/useAuth.ts`

Lit `AuthContext` avec `useContext`.

Retourne :

- `authenticated`
- `checking`
- `user`
- `login`
- `register`
- `logout`
- `refreshSession`

Si le hook est appele hors de `AuthProvider`, il lance une erreur.

## `useObserver`

Fichier : `src/hooks/useObserver.ts`

Utilise `IntersectionObserver` pour savoir si un element est visible.

Signature :

```ts
useObserver(threshold = 0.2, toggleOnExit = false)
```

Retour :

```ts
[ref, isVisible]
```

Comportement :

- si `toggleOnExit` vaut `false`, l'element reste marque visible apres sa premiere apparition ;
- si `toggleOnExit` vaut `true`, `isVisible` suit l'entree et la sortie de l'ecran.

Utilisation actuelle :

- animation des logos dans `Home.tsx`.

## `useScroll`

Fichier : `src/hooks/useScroll.ts`

Calcule la progression de scroll d'un element reference.

Retour :

```ts
[scrollProgress, isVisible]
```

- `scrollProgress` est compris entre `0` et `1`.
- `isVisible` indique si la section est dans le viewport.

Utilisation actuelle :

- animation geometrique dans `Home.tsx`.


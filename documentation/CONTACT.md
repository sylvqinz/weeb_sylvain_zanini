# Contact

La page contact est definie dans `src/pages/Contact.tsx`.

## Objectif

Elle permet a un visiteur d'envoyer un message au backend.

La route `/contact` est publique.

## Champs du formulaire

Le formulaire contient :

- nom ;
- prenom ;
- email ;
- objet ;
- message.

Tous les champs sont obligatoires cote frontend grace a l'attribut `required`.

## Payload envoye

Le composant transforme l'etat local en payload backend :

```ts
{
  first_name: firstName,
  last_name: lastName,
  email,
  subject,
  message: content,
}
```

## Endpoint

La fonction `sendContact` appelle :

```txt
POST /contact/
```

## Comportement apres envoi

En cas de succes :

- tous les champs sont vides ;
- le message `Votre message a bien été envoyé.` est affiche.

En cas d'erreur :

- le message renvoye par le backend est affiche si possible ;
- sinon le fallback est `Impossible d'envoyer le message.`


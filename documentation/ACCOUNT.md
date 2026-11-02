# Compte Utilisateur

La page compte est definie dans `src/pages/Account.tsx`.
La page de parametres est definie dans `src/pages/AccountSettings.tsx`.
La confirmation de changement d'email est definie dans `src/pages/ConfirmEmailChange.tsx`.

## Acces

Les routes `/account` et `/account/settings` sont protegees par `ProtectedRoute`.

Un utilisateur non connecte est redirige vers `/login`.

La route `/confirm-email-change` est publique afin de pouvoir etre ouverte
depuis le lien recu par email.

## Donnees affichees

La page affiche :

- le nom de l'utilisateur ;
- son email ;
- le nombre de ses articles et de ses favoris ;
- la liste de ses articles ;
- la liste de ses favoris.

La carte profil contient un bouton engrenage qui redirige vers
`/account/settings`.

## Parametres du compte

La page `/account/settings` regroupe :

- la modification du prenom, du nom et de l'email ;
- la modification du mot de passe ;
- la configuration de la double authentification TOTP.

La modification du profil utilise :

```txt
PATCH /users/
```

Pour le prenom et le nom, le front envoie uniquement les champs modifies :

```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

Pour l'email, le front envoie la nouvelle adresse avec `PATCH /users/`.
Le backend envoie ensuite un email a l'adresse actuelle contenant un lien vers :

```txt
/confirm-email-change?token=...
```

La page de confirmation demande le mot de passe actuel puis appelle :

```txt
POST /users/email-change/confirm/
```

Payload :

```json
{
  "token": "...",
  "current_password": "MotDePasseActuel123!"
}
```

Pour le mot de passe, le formulaire est separe et demande dans l'ordre :

1. mot de passe actuel ;
2. nouveau mot de passe ;
3. confirmation du nouveau mot de passe.

Payload :

```json
{
  "current_password": "MotDePasseActuel123!",
  "password": "NouveauMotDePasse123!",
  "password_confirm": "NouveauMotDePasse123!"
}
```

Le mot de passe actuel est donc demande directement dans le formulaire de mot
de passe, et dans la page de confirmation d'email.

## Double authentification

Le composant `TwoFactorSettings` permet d'activer la 2FA avec un QR code et une
cle manuelle, de confirmer l'activation avec un code a six chiffres, puis de la
desactiver avec un nouveau code TOTP.

Il est affiche dans `/account/settings`.

## Identification de l'utilisateur

Le nom est construit avec :

1. `first_name` + `last_name`
2. `username`
3. `email`
4. `Utilisateur`

Cette logique utilise le helper partage `getDisplayName`.

## Articles personnels et favoris

La page charge directement les deux listes avec les routes authentifiees :

```txt
GET /users/me/articles/
GET /users/me/favorites/
```

Le client API ajoute automatiquement l'en-tete suivant a ces requetes :

```txt
Authorization: Bearer <access_token>
```

## Actions

Pour chaque article personnel, l'utilisateur peut :

- voir l'article ;
- modifier l'article ;
- supprimer l'article.

La suppression utilise :

```txt
DELETE /articles/:slug/
```

et retire ensuite l'article de l'etat local.

Les cartes des deux listes permettent egalement d'ajouter ou de retirer un
favori. La reponse remplace localement `is_favorite` et `favorites_count` ; un
article retire des favoris disparait immediatement de la liste correspondante.

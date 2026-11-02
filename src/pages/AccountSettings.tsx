import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import TwoFactorSettings from "../components/TwoFactorSettings";
import { useAuth } from "../hooks/useAuth";
import { ApiError, isApiErrorCode } from "../lib/api";
import { type AuthUser, type UpdateProfilePayload } from "../lib/auth";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
};

type PasswordFormState = {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
};

type ProfileFieldErrors = Partial<Record<keyof ProfileFormState, string>>;

type PasswordFieldErrors = Partial<Record<keyof PasswordFormState, string>> & {
  passwordDetails?: string[];
};

function getUserString(user: AuthUser | null, key: string) {
  const value = user?.[key];
  return typeof value === "string" ? value : "";
}

function getInitialProfileForm(user: AuthUser | null): ProfileFormState {
  return {
    firstName: getUserString(user, "first_name"),
    lastName: getUserString(user, "last_name"),
    email: getUserString(user, "email"),
  };
}

function getInitialPasswordForm(): PasswordFormState {
  return {
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  };
}

export default function AccountSettings() {
  const { user, updateProfile } = useAuth();
  const [profileForm, setProfileForm] = useState<ProfileFormState>(() => getInitialProfileForm(user));
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(() => getInitialPasswordForm());
  const [profileErrors, setProfileErrors] = useState<ProfileFieldErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordFieldErrors>({});
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileHasError, setProfileHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setProfileForm(getInitialProfileForm(user));
    setProfileErrors({});
  }, [user]);

  const emailChanged = profileForm.email.trim() !== getUserString(user, "email").trim();
  const firstNameChanged = profileForm.firstName.trim() !== getUserString(user, "first_name").trim();
  const lastNameChanged = profileForm.lastName.trim() !== getUserString(user, "last_name").trim();

  function updateProfileField(field: keyof ProfileFormState, value: string) {
    setProfileForm((currentForm) => ({ ...currentForm, [field]: value }));
    setProfileErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setProfileMessage("");
  }

  function updatePasswordField(field: keyof PasswordFormState, value: string) {
    setPasswordForm((currentForm) => ({ ...currentForm, [field]: value }));
    setPasswordErrors((currentErrors) => ({ ...currentErrors, [field]: undefined, passwordDetails: undefined }));
    setPasswordMessage("");
  }

  function applyProfileError(error: unknown) {
    const nextErrors: ProfileFieldErrors = {};

    if (isApiErrorCode(error, "EMAIL_ALREADY_EXISTS")) {
      nextErrors.email = "Cet email est déjà utilisé.";
    }

    setProfileErrors(nextErrors);
    setProfileHasError(true);
    setProfileMessage(
      Object.keys(nextErrors).length > 0
        ? "Impossible de mettre à jour le profil."
        : error instanceof Error
          ? error.message
          : "Impossible de mettre à jour le profil.",
    );
  }

  function applyPasswordError(error: unknown) {
    const nextErrors: PasswordFieldErrors = {};

    if (isApiErrorCode(error, "CURRENT_PASSWORD_REQUIRED")) {
      nextErrors.currentPassword = "Le mot de passe actuel est requis.";
    } else if (isApiErrorCode(error, "INVALID_CURRENT_PASSWORD")) {
      nextErrors.currentPassword = "Mot de passe actuel invalide.";
    } else if (isApiErrorCode(error, "PASSWORD_FIELDS_REQUIRED")) {
      nextErrors.password = "Renseignez le nouveau mot de passe et sa confirmation.";
    } else if (isApiErrorCode(error, "PASSWORD_MISMATCH")) {
      nextErrors.passwordConfirm = "Les mots de passe ne correspondent pas.";
    } else if (isApiErrorCode(error, "WEAK_PASSWORD")) {
      nextErrors.password = "Mot de passe trop faible.";
      nextErrors.passwordDetails =
        error instanceof ApiError && error.details?.length
          ? error.details
          : [error instanceof Error ? error.message : "Choisissez un mot de passe plus robuste."];
    }

    setPasswordErrors(nextErrors);
    setPasswordHasError(true);
    setPasswordMessage(
      Object.keys(nextErrors).length > 0
        ? "Impossible de mettre à jour le mot de passe."
        : error instanceof Error
          ? error.message
          : "Impossible de mettre à jour le mot de passe.",
    );
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileErrors({});
    setProfileMessage("");
    setProfileHasError(false);

    const payload: UpdateProfilePayload = {};
    const firstName = profileForm.firstName.trim();
    const lastName = profileForm.lastName.trim();
    const email = profileForm.email.trim();

    if (firstNameChanged) {
      payload.first_name = firstName;
    }

    if (lastNameChanged) {
      payload.last_name = lastName;
    }

    if (emailChanged) {
      payload.email = email;
    }

    if (Object.keys(payload).length === 0) {
      setProfileMessage("Aucune modification à enregistrer.");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await updateProfile(payload);
      setProfileMessage(response.message || "Profil mis à jour avec succès.");
      setProfileHasError(false);
      setProfileForm(getInitialProfileForm(response.user || user));
    } catch (error) {
      applyProfileError(error);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordErrors({});
    setPasswordMessage("");
    setPasswordHasError(false);

    if (!passwordForm.currentPassword.trim()) {
      setPasswordErrors({ currentPassword: "Le mot de passe actuel est requis." });
      setPasswordHasError(true);
      setPasswordMessage("Impossible de mettre à jour le mot de passe.");
      return;
    }

    if (!passwordForm.password || !passwordForm.passwordConfirm) {
      setPasswordErrors({ password: "Renseignez le nouveau mot de passe et sa confirmation." });
      setPasswordHasError(true);
      setPasswordMessage("Impossible de mettre à jour le mot de passe.");
      return;
    }

    if (passwordForm.password !== passwordForm.passwordConfirm) {
      setPasswordErrors({ passwordConfirm: "Les mots de passe ne correspondent pas." });
      setPasswordHasError(true);
      setPasswordMessage("Impossible de mettre à jour le mot de passe.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await updateProfile({
        current_password: passwordForm.currentPassword,
        password: passwordForm.password,
        password_confirm: passwordForm.passwordConfirm,
      });
      setPasswordMessage(response.message || "Mot de passe mis à jour avec succès.");
      setPasswordHasError(false);
      setPasswordForm(getInitialPasswordForm());
    } catch (error) {
      applyPasswordError(error);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <section className="px-6 pb-20 max-w-3xl mx-auto">
      <div className="mb-10">
        <Link to="/account" className="mb-6 inline-flex text-purple-300 transition hover:text-purple-200">
          Retour au compte
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Paramètres du compte</h1>
      </div>

      <div className="space-y-8">
        <form className="space-y-6 rounded-lg border border-purple-500/40 bg-[#20223f] p-6" onSubmit={handleProfileSubmit}>
          <h2 className="text-2xl font-semibold">Profil</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="account-first-name"
              label="Prénom"
              variant="panel"
              type="text"
              value={profileForm.firstName}
              onChange={(event) => updateProfileField("firstName", event.target.value)}
              autoComplete="given-name"
            />

            <TextField
              id="account-last-name"
              label="Nom"
              variant="panel"
              type="text"
              value={profileForm.lastName}
              onChange={(event) => updateProfileField("lastName", event.target.value)}
              autoComplete="family-name"
            />
          </div>

          <TextField
            id="account-email"
            label="Email"
            variant="panel"
            type="email"
            value={profileForm.email}
            onChange={(event) => updateProfileField("email", event.target.value)}
            autoComplete="email"
            error={profileErrors.email}
          />

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={savingProfile}
            >
              {savingProfile ? "Enregistrement..." : "Enregistrer le profil"}
            </Button>

            {profileMessage && (
              <p className={`text-sm ${profileHasError ? "text-red-200" : "text-green-300"}`} aria-live="polite">
                {profileMessage}
              </p>
            )}
          </div>
        </form>

        <form className="space-y-6 rounded-lg border border-purple-500/40 bg-[#20223f] p-6" onSubmit={handlePasswordSubmit}>
          <h2 className="text-2xl font-semibold">Mot de passe</h2>

          <TextField
            id="account-password-current"
            label="Mot de passe actuel"
            variant="panel"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
            required
            autoComplete="current-password"
            error={passwordErrors.currentPassword}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <TextField
                id="account-password-new"
                label="Nouveau mot de passe"
                variant="panel"
                type="password"
                value={passwordForm.password}
                onChange={(event) => updatePasswordField("password", event.target.value)}
                required
                autoComplete="new-password"
                error={passwordErrors.password}
              />
              {passwordErrors.passwordDetails && (
                <ul className="mt-2 space-y-1 text-sm text-red-200">
                  {passwordErrors.passwordDetails.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>

            <TextField
              id="account-password-confirm"
              label="Confirmer le mot de passe"
              variant="panel"
              type="password"
              value={passwordForm.passwordConfirm}
              onChange={(event) => updatePasswordField("passwordConfirm", event.target.value)}
              required
              autoComplete="new-password"
              error={passwordErrors.passwordConfirm}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={savingPassword}>
              {savingPassword ? "Enregistrement..." : "Enregistrer le mot de passe"}
            </Button>

            {passwordMessage && (
              <p className={`text-sm ${passwordHasError ? "text-red-200" : "text-green-300"}`} aria-live="polite">
                {passwordMessage}
              </p>
            )}
          </div>
        </form>

        <TwoFactorSettings />

        <Button to="/account" variant="secondary">
          Retour au compte
        </Button>
      </div>
    </section>
  );
}

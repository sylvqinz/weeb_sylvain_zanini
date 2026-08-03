import { type FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isApiErrorCode } from "../lib/api";

const inputClass =
  "w-full rounded-lg border border-purple-500/50 bg-[#15172c] px-4 py-3 text-white outline-none transition focus:border-purple-400";

export default function ConfirmEmailChange() {
  const [searchParams] = useSearchParams();
  const { authenticated, confirmEmailChange } = useAuth();
  const token = searchParams.get("token") || "";
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasError, setHasError] = useState(!token);
  const [loading, setLoading] = useState(false);

  function applyError(error: unknown) {
    setHasError(true);

    if (isApiErrorCode(error, "CURRENT_PASSWORD_REQUIRED")) {
      setPasswordError("Le mot de passe actuel est requis.");
      setMessage("Impossible de confirmer le changement d'email.");
      return;
    }

    if (isApiErrorCode(error, "INVALID_CURRENT_PASSWORD")) {
      setPasswordError("Mot de passe actuel invalide.");
      setMessage("Impossible de confirmer le changement d'email.");
      return;
    }

    if (isApiErrorCode(error, "INVALID_EMAIL_CHANGE_TOKEN")) {
      setMessage("Ce lien de confirmation est invalide.");
      return;
    }

    if (isApiErrorCode(error, "EMAIL_CHANGE_TOKEN_EXPIRED")) {
      setMessage("Ce lien de confirmation a expiré.");
      return;
    }

    setMessage(error instanceof Error ? error.message : "Impossible de confirmer le changement d'email.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setPasswordError("");
    setHasError(false);

    if (!token) {
      setHasError(true);
      setMessage("Lien de confirmation invalide.");
      return;
    }

    if (!currentPassword.trim()) {
      setHasError(true);
      setPasswordError("Le mot de passe actuel est requis.");
      setMessage("Impossible de confirmer le changement d'email.");
      return;
    }

    setLoading(true);

    try {
      const response = await confirmEmailChange({
        token,
        current_password: currentPassword,
      });
      setCurrentPassword("");
      setHasError(false);
      setMessage(response.message || "Adresse email mise à jour avec succès.");
    } catch (error) {
      applyError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-6 pb-20 max-w-2xl mx-auto">
      <div className="mb-10">
        <Link to={authenticated ? "/account/settings" : "/login"} className="mb-6 inline-flex text-purple-300 transition hover:text-purple-200">
          {authenticated ? "Retour aux paramètres" : "Retour à la connexion"}
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Confirmer l'email</h1>
      </div>

      <form className="space-y-6 rounded-lg border border-purple-500/40 bg-[#20223f] p-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="confirm-email-current-password" className="mb-2 block text-sm text-purple-200">
            Mot de passe actuel
          </label>
          <input
            id="confirm-email-current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setPasswordError("");
              setMessage("");
            }}
            required
            autoComplete="current-password"
            disabled={!token}
            className={inputClass}
          />
          {passwordError && <p className="mt-2 text-sm text-red-200">{passwordError}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading || !token}
            className="rounded-lg bg-purple-600 px-5 py-2 text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Confirmation..." : "Confirmer"}
          </button>

          {message && (
            <p className={`text-sm ${hasError ? "text-red-200" : "text-green-300"}`} aria-live="polite">
              {message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

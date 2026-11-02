import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { confirmPasswordReset, requestPasswordReset } from "../lib/auth";
import { ApiError } from "../lib/api";

function getResetErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === "WEAK_PASSWORD") {
      return ["Mot de passe trop faible.", ...(error.details ?? [])].join(" ");
    }

    if (error.code === "PASSWORD_MISMATCH") {
      return "Les mots de passe ne correspondent pas.";
    }

    if (error.code && /(TOKEN|UID|RESET_LINK)/.test(error.code) && /(INVALID|EXPIRED)/.test(error.code)) {
      return "Ce lien de réinitialisation est invalide ou a expiré. Demandez un nouveau lien.";
    }
  }

  return error instanceof Error ? error.message : "Impossible de contacter le serveur.";
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  // Sans parametres, la page permet de demander un nouveau lien par email.
  const uidb64 = searchParams.get("uidb64")?.trim();
  const token = searchParams.get("token")?.trim();
  const isConfirmMode = Boolean(uidb64 && token);
  const hasResetParams = searchParams.has("uidb64") || searchParams.has("token");
  const linkError = hasResetParams && !isConfirmMode
    ? "Lien de réinitialisation incomplet ou invalide. Demandez un nouveau lien ci-dessous."
    : "";

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  async function handleRequestSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await requestPasswordReset({ email });
      setMessage("Si ce compte existe, un email de réinitialisation a été envoyé.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || resetComplete) return;
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!uidb64 || !token) {
      setMessage("Lien de réinitialisation invalide.");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset({ uidb64, token, password, password_confirm: confirmPassword });
      setResetComplete(true);
      setMessage("Mot de passe réinitialisé avec succès. Redirection vers la connexion...");

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }

      redirectTimerRef.current = setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      setMessage(getResetErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="md:text-4xl font-bold text-white mb-12">
          {isConfirmMode ? "Nouveau mot de passe" : "Mot de passe oublié"}
        </h1>

        {isConfirmMode ? (
          <form className="space-y-10" onSubmit={handleConfirmSubmit}>
            <TextField
              label="Nouveau mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading || resetComplete}
              required
              align="center"
            />

            <TextField
              label="Confirmation du mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading || resetComplete}
              required
              align="center"
            />

            {message && <p role="status" className="text-sm text-purple-300">{message}</p>}

            <Button
              type="submit"
              disabled={loading || resetComplete}
              className="mt-4 px-10"
            >
              {loading ? "Modification..." : "Réinitialiser"}
            </Button>
          </form>
        ) : (
          <form className="space-y-10" onSubmit={handleRequestSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              align="center"
            />

            {(message || linkError) && <p role="status" className="text-sm text-purple-300">{message || linkError}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 px-10"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </form>
        )}

        <p className="mt-8 text-gray-400">
          Vous vous souvenez du mot de passe ?{" "}
          <Link to="/login" className="text-purple-500 cursor-pointer hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}

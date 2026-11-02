import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { confirmPasswordReset, requestPasswordReset } from "../lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Le lien email contient uidb64 et token; sans eux, on affiche la demande d'email.
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");
  const isConfirmMode = Boolean(uidb64 && token);

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
      await confirmPasswordReset({ uidb64, token, password });
      setMessage("Mot de passe réinitialisé avec succès.");

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }

      redirectTimerRef.current = setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de contacter le serveur.");
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
              required
              align="center"
            />

            <TextField
              label="Confirmation du mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              align="center"
            />

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <Button
              type="submit"
              disabled={loading}
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

            {message && <p className="text-sm text-purple-300">{message}</p>}

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

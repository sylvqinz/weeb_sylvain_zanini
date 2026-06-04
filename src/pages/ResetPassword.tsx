import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { confirmPasswordReset, requestPasswordReset } from "../lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Le lien email contient uidb64 et token; sans eux, on affiche la demande d'email.
  const params = new URLSearchParams(window.location.search);
  const uidb64 = params.get("uidb64");
  const token = params.get("token");
  const isConfirmMode = Boolean(uidb64 && token);

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

      setTimeout(() => {
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
            <div>
              <label className="block text-purple-400 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center"
              />
            </div>

            <div>
              <label className="block text-purple-400 mb-2">Confirmation du mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center"
              />
            </div>

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-10 py-2 rounded-lg transition"
            >
              {loading ? "Modification..." : "Réinitialiser"}
            </button>
          </form>
        ) : (
          <form className="space-y-10" onSubmit={handleRequestSubmit}>
            <div>
              <label className="block text-purple-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center"
              />
            </div>

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-10 py-2 rounded-lg transition"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
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

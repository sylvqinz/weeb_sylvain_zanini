import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { requestPasswordReset } from "../lib/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setMessage("");
    setLoading(true);

    try {
      await requestPasswordReset({ email });
      setMessage("Si un compte est associé à cet email, vous recevrez des instructions.");
    } catch {
      setMessage("Impossible d’envoyer la demande de réinitialisation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="md:text-4xl font-bold text-white mb-12">
          Mot de passe oublié
        </h1>

        <form className="space-y-10" onSubmit={handleRequestSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
            required
            align="center"
          />

          {message && <p role="status" className="text-sm text-purple-300">{message}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 px-10"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </Button>
        </form>

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

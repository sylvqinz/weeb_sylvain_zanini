import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as LoginLocationState | null)?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await login({ email, password });
      setMessage("Connexion réussie.");
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="md:text-4xl font-bold text-white mb-12">Se connecter</h1>

        <form className="space-y-10" onSubmit={handleSubmit}>
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

          <div>
            <label className="block text-purple-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 space-y-4 text-sm">
          <Link to="/reset-password" className="block text-white cursor-pointer hover:underline">
            Mot de passe oublié ?
          </Link>

          <p className="text-gray-400">
            Vous n’avez pas de compte ?{" "}
            <Link to="/signup" className="text-purple-500 cursor-pointer hover:underline">
              Vous pouvez en créer un
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

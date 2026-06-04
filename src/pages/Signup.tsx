import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const session = await register({
        email,
        password,
        password_confirm: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      });
      setMessage("Compte créé avec succès.");

      setTimeout(() => {
        navigate(session ? "/" : "/login");
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
        <h1 className="md:text-4xl font-bold text-white mb-12">S'inscrire</h1>

        <form className="space-y-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-purple-400 mb-2">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center"
            />
          </div>

          <div>
            <label className="block text-purple-400 mb-2">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center"
            />
          </div>

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

          <div>
            <label className="block text-purple-400 mb-2">Confirmer le password</label>
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
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-8 text-gray-400">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-purple-500 cursor-pointer hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}

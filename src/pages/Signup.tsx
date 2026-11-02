import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

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

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }

      redirectTimerRef.current = setTimeout(() => {
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
          <TextField label="Prénom" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required align="center" />
          <TextField label="Nom" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required align="center" />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required align="center" />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required align="center" />
          <TextField
            label="Confirmer le password"
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
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>
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

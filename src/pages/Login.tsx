import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isApiErrorCode } from "../lib/api";

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

function getSixDigitCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyTwoFactorLogin } = useAuth();
  const from = (location.state as LoginLocationState | null)?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const awaitingTwoFactor = Boolean(twoFactorToken);

  function resetTwoFactor(message = "") {
    setTwoFactorToken("");
    setCode("");
    setMessage(message);
  }

  async function handleCredentialsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await login({ email, password });

      if (result.requiresTwoFactor) {
        setPassword("");
        setTwoFactorToken(result.twoFactorToken);
        setCode("");
        return;
      }

      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactorSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (code.length !== 6) {
      setMessage("Saisissez un code à 6 chiffres.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await verifyTwoFactorLogin({ two_factor_token: twoFactorToken, code });
      navigate(from, { replace: true });
    } catch (error) {
      if (isApiErrorCode(error, "INVALID_TWO_FACTOR_CODE")) {
        setMessage("Code invalide");
        return;
      }

      if (isApiErrorCode(error, "TWO_FACTOR_TOKEN_EXPIRED")) {
        resetTwoFactor("La vérification a expiré. Veuillez vous reconnecter.");
        return;
      }

      setMessage(error instanceof Error ? error.message : "Impossible de vérifier le code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="md:text-4xl font-bold text-white mb-12">
          {awaitingTwoFactor ? "Vérification en deux étapes" : "Se connecter"}
        </h1>

        {awaitingTwoFactor ? (
          <form className="space-y-8" onSubmit={handleTwoFactorSubmit}>
            <div>
              <label htmlFor="login-two-factor-code" className="block text-purple-400 mb-3">
                Code de votre application d'authentification
              </label>
              <input
                id="login-two-factor-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(getSixDigitCode(e.target.value))}
                required
                autoFocus
                className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-3 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center text-2xl tracking-[0.5em]"
              />
            </div>

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-8 py-2 rounded-lg transition"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </button>
              <button
                type="button"
                onClick={() => resetTwoFactor()}
                disabled={loading}
                className="border border-purple-500/60 hover:bg-purple-500/10 disabled:opacity-60 text-purple-200 px-8 py-2 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <>
            <form className="space-y-10" onSubmit={handleCredentialsSubmit}>
              <div>
                <label htmlFor="login-email" className="block text-purple-400 mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition text-center"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-purple-400 mb-2">
                  Mot de passe
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
          </>
        )}
      </div>
    </section>
  );
}

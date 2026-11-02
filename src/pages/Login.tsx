import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
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
            <TextField
              id="login-two-factor-code"
              label="Code de votre application d'authentification"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(getSixDigitCode(e.target.value))}
              required
              autoFocus
              align="center"
              fieldClassName="py-3 text-2xl tracking-[0.5em]"
            />

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="px-8"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
              <Button
                type="button"
                onClick={() => resetTwoFactor()}
                disabled={loading}
                variant="secondary"
                className="px-8"
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <>
            <form className="space-y-10" onSubmit={handleCredentialsSubmit}>
              <TextField
                id="login-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                align="center"
              />

              <TextField
                id="login-password"
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                align="center"
              />

              {message && <p className="text-sm text-purple-300">{message}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="mt-4 px-10"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
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

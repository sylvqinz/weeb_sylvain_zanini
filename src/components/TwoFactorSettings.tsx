import { type FormEvent, useState } from "react";
import QRCode from "react-qr-code";
import { useAuth } from "../hooks/useAuth";
import { type TwoFactorSetup } from "../lib/auth";
import { isApiErrorCode } from "../lib/api";
import Button from "./Button";

function getSixDigitCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

type CodeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

function CodeInput({ id, value, onChange }: CodeInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-purple-200">
        Code à 6 chiffres
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        value={value}
        onChange={(event) => onChange(getSixDigitCode(event.target.value))}
        required
        className="w-full max-w-xs rounded-lg border border-purple-500/50 bg-[#15172c] px-4 py-3 text-center text-xl tracking-[0.4em] text-white outline-none transition focus:border-purple-400"
      />
    </div>
  );
}

export default function TwoFactorSettings() {
  const { user, setupTwoFactor, confirmTwoFactor, disableTwoFactor } = useAuth();
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const isEnabled = user?.is_two_factor_enabled === true;

  function showError(error: unknown, fallback: string) {
    setHasError(true);
    setMessage(
      isApiErrorCode(error, "INVALID_TWO_FACTOR_CODE")
        ? "Code invalide"
        : error instanceof Error
          ? error.message
          : fallback,
    );
  }

  async function handleSetup() {
    setLoading(true);
    setMessage("");
    setHasError(false);

    try {
      const data = await setupTwoFactor();
      setSetup(data);
      setCode("");
    } catch (error) {
      showError(error, "Impossible d'initialiser la double authentification.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.length !== 6) {
      setHasError(true);
      setMessage("Saisissez un code à 6 chiffres.");
      return;
    }

    setLoading(true);
    setMessage("");
    setHasError(false);

    try {
      await confirmTwoFactor(code);
      setSetup(null);
      setCode("");
      setMessage("Double authentification activée.");
    } catch (error) {
      showError(error, "Impossible d'activer la double authentification.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.length !== 6) {
      setHasError(true);
      setMessage("Saisissez un code à 6 chiffres.");
      return;
    }

    setLoading(true);
    setMessage("");
    setHasError(false);

    try {
      await disableTwoFactor(code);
      setShowDisableForm(false);
      setCode("");
      setMessage("Double authentification désactivée.");
    } catch (error) {
      showError(error, "Impossible de désactiver la double authentification.");
    } finally {
      setLoading(false);
    }
  }

  function cancelSetup() {
    setSetup(null);
    setCode("");
    setMessage("");
    setHasError(false);
  }

  function cancelDisable() {
    setShowDisableForm(false);
    setCode("");
    setMessage("");
    setHasError(false);
  }

  function startDisable() {
    setShowDisableForm(true);
    setCode("");
    setMessage("");
    setHasError(false);
  }

  return (
    <div className="rounded-lg border border-purple-500/40 bg-[#20223f] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Double authentification</h2>
          <p className="mt-2 text-gray-300">
            Statut :{" "}
            <span className={isEnabled ? "text-green-300" : "text-gray-400"}>
              {isEnabled ? "activée" : "désactivée"}
            </span>
          </p>
        </div>

        {!setup && !showDisableForm && (
          <Button
            type="button"
            onClick={isEnabled ? startDisable : handleSetup}
            disabled={loading}
            variant={isEnabled ? "dangerOutline" : "primary"}
            className="w-fit"
          >
            {loading ? "Chargement..." : isEnabled ? "Désactiver" : "Activer"}
          </Button>
        )}
      </div>

      {setup && !isEnabled && (
        <div className="mt-8 border-t border-purple-500/30 pt-6">
          <p className="text-gray-300">
            Scannez ce QR code avec votre application d'authentification, puis saisissez le code généré.
          </p>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            <div className="w-fit rounded-lg bg-white p-4">
              <QRCode value={setup.provisioning_uri} size={192} title="QR code de configuration 2FA" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-400">Clé de saisie manuelle</p>
              <code className="mt-2 block break-all rounded-lg bg-[#15172c] p-4 text-purple-200 select-all">
                {setup.secret}
              </code>

              <form className="mt-6 space-y-5" onSubmit={handleConfirm}>
                <CodeInput id="two-factor-confirm-code" value={code} onChange={setCode} />
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    disabled={loading || code.length !== 6}
                  >
                    {loading ? "Confirmation..." : "Confirmer"}
                  </Button>
                  <Button
                    type="button"
                    onClick={cancelSetup}
                    disabled={loading}
                    variant="secondary"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDisableForm && isEnabled && (
        <form className="mt-8 space-y-5 border-t border-purple-500/30 pt-6" onSubmit={handleDisable}>
          <p className="text-gray-300">
            Saisissez un code actuel de votre application d'authentification pour désactiver la protection.
          </p>
          <CodeInput id="two-factor-disable-code" value={code} onChange={setCode} />
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              variant="danger"
            >
              {loading ? "Désactivation..." : "Confirmer la désactivation"}
            </Button>
            <Button
              type="button"
              onClick={cancelDisable}
              disabled={loading}
              variant="secondary"
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      {message && (
        <p className={`mt-5 text-sm ${hasError ? "text-red-200" : "text-green-300"}`} aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}

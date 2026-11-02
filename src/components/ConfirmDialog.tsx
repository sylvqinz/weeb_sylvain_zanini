import Button from "./Button";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "primary",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-lg border border-purple-500/40 bg-[#20223f] p-6 text-left shadow-2xl"
      >
        <h2 id="confirm-dialog-title" className="text-xl font-semibold text-white">
          {title}
        </h2>
        <p className="mt-3 text-base text-gray-300">{message}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

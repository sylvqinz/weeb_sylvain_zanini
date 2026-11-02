import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from "react";

type FieldVariant = "underline" | "panel";
type FieldAlign = "left" | "center";

type BaseTextFieldProps = {
  label: string;
  id?: string;
  error?: string;
  variant?: FieldVariant;
  align?: FieldAlign;
  wrapperClassName?: string;
  fieldClassName?: string;
};

type TextInputProps = BaseTextFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
    multiline?: false;
  };

type TextAreaProps = BaseTextFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "id"> & {
    multiline: true;
  };

type TextFieldProps = TextInputProps | TextAreaProps;

const labelClasses: Record<FieldVariant, string> = {
  underline: "block text-purple-400 mb-2",
  panel: "mb-2 block text-sm text-purple-200",
};

const fieldClasses: Record<FieldVariant, string> = {
  underline:
    "w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 transition focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea]",
  panel:
    "w-full rounded-lg border border-purple-500/50 bg-[#15172c] px-4 py-3 text-white outline-none transition focus:border-purple-400",
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function TextField(props: TextFieldProps) {
  const generatedId = useId();
  const {
    label,
    id = generatedId,
    error,
    variant = "underline",
    align = "left",
    wrapperClassName,
    fieldClassName,
  } = props;
  const inputClassName = cx(fieldClasses[variant], align === "center" && "text-center", fieldClassName);

  if (props.multiline) {
    const {
      label: _label,
      id: _id,
      error: _error,
      variant: _variant,
      align: _align,
      wrapperClassName: _wrapperClassName,
      fieldClassName: _fieldClassName,
      multiline: _multiline,
      ...textareaProps
    } = props;

    return (
      <div className={wrapperClassName}>
        <label htmlFor={id} className={labelClasses[variant]}>
          {label}
        </label>
        <textarea id={id} className={inputClassName} {...textareaProps} />
        {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
      </div>
    );
  }

  const {
    label: _label,
    id: _id,
    error: _error,
    variant: _variant,
    align: _align,
    wrapperClassName: _wrapperClassName,
    fieldClassName: _fieldClassName,
    multiline: _multiline,
    ...inputProps
  } = props;

  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className={labelClasses[variant]}>
        {label}
      </label>
      <input id={id} className={inputClassName} {...inputProps} />
      {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
    </div>
  );
}

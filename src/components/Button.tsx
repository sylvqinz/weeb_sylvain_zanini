import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "danger" | "dangerOutline" | "gradient" | "heroGradient" | "whiteOutline";
type ButtonSize = "sm" | "md" | "lg";

type CommonButtonProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type NativeButtonProps = CommonButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
  };

type LinkButtonProps = CommonButtonProps &
  Omit<LinkProps, "className"> & {
    disabled?: never;
    type?: never;
  };

type ButtonProps = NativeButtonProps | LinkButtonProps;

const baseClass =
  "inline-flex items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "border border-purple-500/60 text-purple-200 hover:bg-purple-500/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
  dangerOutline: "border border-red-400/70 text-red-200 hover:bg-red-500/10",
  gradient:
    "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-600/30 hover:from-purple-400 hover:to-purple-600",
  heroGradient:
    "border-2 border-transparent bg-gradient-to-r from-purple-600 to-purple-500 font-medium hover:from-purple-500 hover:to-purple-400",
  whiteOutline: "border-2 border-white font-medium hover:border-gray-400 hover:bg-slate-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2",
  lg: "px-8 py-3",
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function isLinkButtonProps(props: ButtonProps): props is LinkButtonProps {
  return "to" in props && props.to !== undefined;
}

export default function Button(props: ButtonProps) {
  const { children, className, size = "md", variant = "primary" } = props;
  const buttonClassName = cx(baseClass, variantClasses[variant], sizeClasses[size], className);

  if (isLinkButtonProps(props)) {
    const { children: _children, className: _className, size: _size, variant: _variant, ...linkProps } = props;

    return (
      <Link {...linkProps} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  const { children: _children, className: _className, size: _size, variant: _variant, ...buttonProps } = props;

  return (
    <button {...buttonProps} className={buttonClassName}>
      {children}
    </button>
  );
}

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  leftIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", leftIcon, children, className = "", ...props },
  ref
) {
  const base =
    "inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#5ab2e2] disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  const variants = {
    primary:   "bg-nee-green text-white hover:bg-nee-greenDark",
    secondary: "bg-white border border-edge text-ink-secondary hover:border-nee-blue hover:text-nee-blueLink",
    ghost:     "text-ink-secondary hover:bg-surface-primary hover:text-ink-primary",
  };
  return (
    <button
      ref={ref}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
});

import { Loader as Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-[#457D58] text-white hover:bg-[#386849] shadow-sm",
  secondary:
    "bg-[#f0f6f2] text-[#457D58] hover:bg-[#e1eee5]",
  outline:
    "border border-[#457D58] bg-white text-[#457D58] hover:bg-[#eef7f1]",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  dangerOutline:
    "border border-red-300 bg-white text-red-600 hover:bg-red-50",
};

const SIZES = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-5 py-3 text-sm rounded-2xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;

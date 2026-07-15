import { forwardRef } from "react";

function baseClasses(hasError) {
  return `w-full rounded-2xl border bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#457D58] focus:ring-[#457D58]/15"
  }`;
}

export const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = "", ...rest },
  ref
) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      {Icon ? (
        <div className="flex items-center rounded-2xl border bg-white px-4 transition focus-within:ring-2 focus-within:ring-[#457D58]/15">
          <Icon size={18} className="text-slate-400" />
          <input
            ref={ref}
            className="w-full bg-transparent px-3 py-3 outline-none"
            {...rest}
          />
        </div>
      ) : (
        <input
          ref={ref}
          className={baseClasses(!!error, className)}
          {...rest}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, icon: Icon, children, className = "", ...rest },
  ref
) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="flex items-center rounded-2xl border bg-white px-4 transition focus-within:ring-2 focus-within:ring-[#457D58]/15">
        {Icon && <Icon size={18} className="text-slate-400" />}
        <select
          ref={ref}
          className={`w-full bg-transparent px-3 py-3 outline-none ${className}`}
          {...rest}
        >
          {children}
        </select>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export const TextArea = forwardRef(function TextArea(
  { label, error, className = "", ...rest },
  ref
) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={baseClasses(!!error, className)}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

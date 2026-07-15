import { CircleAlert as AlertCircle } from "lucide-react";

function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/70 p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-500">
        <AlertCircle size={32} />
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-800">
        {message}
      </h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-2xl bg-[#457D58] px-6 py-3 font-semibold text-white transition hover:bg-[#386849]"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;

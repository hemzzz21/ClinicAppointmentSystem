import { Loader as Loader2 } from "lucide-react";

function Spinner({ label = "Loading...", size = 42 }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2
          className="mx-auto animate-spin text-[#457D58]"
          size={size}
        />
        <p className="mt-4 font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}

export default Spinner;

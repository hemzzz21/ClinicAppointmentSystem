const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  NO_SHOW: "bg-slate-200 text-slate-600",
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  BOOKED: "bg-blue-100 text-blue-700",
  NOT_REQUIRED: "bg-slate-100 text-slate-600",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  PATIENT: "bg-[#e6f2e9] text-[#457D58]",
  DOCTOR: "bg-blue-100 text-blue-700",
  ADMIN: "bg-slate-800 text-white",
  HIGH: "bg-red-100 text-red-700",
  NORMAL: "bg-amber-100 text-amber-700",
  LOW: "bg-slate-100 text-slate-600",
};

function Badge({ status, children, className = "" }) {
  const label = children ?? status;
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style} ${className}`}
    >
      {label}
    </span>
  );
}

export default Badge;

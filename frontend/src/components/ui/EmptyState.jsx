function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-10 text-center shadow-sm backdrop-blur">
      {Icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e6f2e9] text-[#457D58]">
          <Icon size={32} />
        </div>
      )}
      <h3 className="mt-5 text-xl font-bold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-2 text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;

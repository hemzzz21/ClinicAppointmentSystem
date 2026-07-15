function Card({ children, className = "", hover = false, ...rest }) {
  const hoverClass = hover
    ? "transition hover:-translate-y-1 hover:shadow-xl"
    : "";

  return (
    <div
      className={`rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;

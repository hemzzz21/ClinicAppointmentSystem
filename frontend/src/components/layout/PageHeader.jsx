import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function PageHeader({ eyebrow, title, subtitle, backTo, action }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backTo && (
          <Link
            to={backTo}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#457D58]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        )}
        {eyebrow && (
          <p className="text-sm font-semibold text-[#457D58]">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export default PageHeader;

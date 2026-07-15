import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../context/useNotifications";
import { ROLE_ICON, ROLE_LABEL, ROLE_NAV } from "./navConfig";
import { initials } from "../../utils/format";

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
          isActive
            ? "bg-white text-[#245438] shadow-lg"
            : "text-white/75 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <Icon size={19} />
      {label}
    </NavLink>
  );
}

function SidebarContent({ role, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = ROLE_NAV[role] || [];
  const RoleIcon = ROLE_ICON[role] || Stethoscope;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Stethoscope size={25} />
        </div>
        <div>
          <h1 className="text-xl font-bold">ClinicCare</h1>
          <p className="text-xs text-white/60">{ROLE_LABEL[role]}</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {items.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          Signed in as
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold">
            {initials(user?.name) || <RoleIcon size={18} />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.name}</p>
            <p className="truncate text-sm text-white/60">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}

function DashboardLayout({ children }) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role;
  const notifPath =
    role === "PATIENT"
      ? "/patient/notifications"
      : role === "DOCTOR"
      ? "/doctor/notifications"
      : "/admin/profile";

  const Sidebar = (
    <aside className="flex h-full w-[280px] flex-col border-r border-white/70 bg-[#183c2b]/95">
      <SidebarContent role={role} onNavigate={() => setMobileOpen(false)} />
    </aside>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dff0e4,_transparent_40%),linear-gradient(135deg,#f7fbf8,#edf5ef)] p-0 md:p-6">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col overflow-hidden rounded-none md:min-h-[calc(100vh-3rem)] md:rounded-[32px] md:border md:border-white/60 md:bg-white/60 md:shadow-[0_30px_80px_rgba(45,83,57,0.18)] md:backdrop-blur-xl lg:grid lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">{Sidebar}</div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative z-10 h-full"
              >
                {Sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-4 border-b border-white/70 bg-white/60 p-4 backdrop-blur lg:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <span className="flex items-center gap-2 font-bold text-[#245438]">
                <Stethoscope size={20} />
                ClinicCare
              </span>
            </div>

            <Link
              to={notifPath}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-600 shadow-sm"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </header>

          {/* Desktop top bar (notification only) */}
          <header className="hidden items-center justify-end gap-4 p-5 lg:flex">
            <Link
              to={notifPath}
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-600 shadow-sm"
            >
              <Bell size={21} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </header>

          <section className="flex-1 p-4 sm:p-6 lg:p-8">{children}</section>
        </div>
      </div>
    </main>
  );
}

export default DashboardLayout;

import { Link } from "react-router-dom";
import { CalendarDays, ShieldCheck, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eef7f1] via-white to-[#e5f1e9]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#457D58] text-white shadow-lg">
            <Stethoscope size={32} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#457D58]">
            Modern Healthcare Platform
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Book clinic appointments
            <span className="block text-[#457D58]">without the waiting stress</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Find doctors, view real-time availability, book appointments,
            manage schedules, and receive instant notifications.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="rounded-xl bg-[#457D58] px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#386849]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl border border-[#457D58] bg-white px-8 py-3.5 font-semibold text-[#457D58] transition hover:bg-[#eef7f1]"
            >
              Create Patient Account
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              title: "Easy Booking",
              text: "Choose a doctor and reserve an available time slot quickly.",
            },
            {
              icon: Stethoscope,
              title: "Doctor Schedules",
              text: "Doctors can manage availability and appointments from one dashboard.",
            },
            {
              icon: ShieldCheck,
              title: "Secure Access",
              text: "Protected accounts for patients, doctors, and administrators.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/70 bg-white/80 p-6 text-left shadow-sm backdrop-blur"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6f1e9] text-[#457D58]">
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
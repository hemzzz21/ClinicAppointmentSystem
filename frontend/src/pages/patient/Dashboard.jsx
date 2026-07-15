import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  HeartPulse,
  Home,
  LoaderCircle,
  LogOut,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getDoctors } from "../../services/doctor.service";
import { getMyAppointments } from "../../services/appointment.service";
import { getUnreadNotificationCount } from "../../services/notification.service";

function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [doctorResponse, appointmentResponse, notificationResponse] =
        await Promise.all([
          getDoctors({ page: 1, limit: 3 }),
          getMyAppointments(),
          getUnreadNotificationCount(),
        ]);

      setDoctors(doctorResponse.data?.doctors || []);
      setAppointments(appointmentResponse.data || []);
      setUnreadCount(
        notificationResponse.data?.unreadCount || 0
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const confirmedAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "CONFIRMED"
      ),
    [appointments]
  );

  const completedCount = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "COMPLETED"
      ).length,
    [appointments]
  );

  const nextAppointment = confirmedAppointments
    .slice()
    .sort(
      (first, second) =>
        new Date(first.slot?.startTime) -
        new Date(second.slot?.startTime)
    )[0];

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    {
      icon: Search,
      label: "Find Doctors",
      action: () => navigate("/patient/doctors"),
    },
    {
      icon: CalendarDays,
      label: "My Appointments",
      action: () => navigate("/patient/appointments"),
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => navigate("/patient/notifications"),
    },
    {
      icon: UserRound,
      label: "Profile",
      action: () => navigate("/patient/profile"),
    },
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8f5]">
        <div className="text-center">
          <LoaderCircle className="mx-auto animate-spin text-[#457D58]" size={42} />
          <p className="mt-4 font-medium text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dff0e4,_transparent_40%),linear-gradient(135deg,#f7fbf8,#edf5ef)] p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-[32px] border border-white/60 bg-white/60 shadow-[0_30px_80px_rgba(45,83,57,0.18)] backdrop-blur-xl md:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-white/70 bg-[#183c2b]/95 p-6 text-white md:flex md:flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Stethoscope size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold">ClinicCare</h1>
              <p className="text-xs text-white/60">Patient Portal</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {menuItems.map(({ icon: Icon, label, active, action }) => (
              <button
                key={label}
                onClick={action}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-white text-[#245438] shadow-lg"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Signed in as
            </p>

            <p className="mt-2 font-semibold">
              {user?.name || "Patient"}
            </p>

            <p className="mt-1 truncate text-sm text-white/60">
              {user?.email}
            </p>

            <button
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </aside>

        <section className="p-5 sm:p-7 lg:p-9">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#457D58]">
                Patient Dashboard
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                Hello, {user?.name?.split(" ")[0] || "Patient"} 👋
              </h2>

              <p className="mt-2 text-slate-500">
                Manage your appointments and find the right doctor.
              </p>
            </div>

            <button
              onClick={() => navigate("/patient/notifications")}
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-600 shadow-sm"
            >
              <Bell size={21} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </header>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#457D58] to-[#2d5f41] p-7 text-white shadow-xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/65">
                Healthcare made simple
              </p>

              <h3 className="mt-4 text-3xl font-bold leading-tight">
                Book appointments without waiting in queues.
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-white/75">
                Explore specialists, check live availability, and
                reserve your preferred appointment slot instantly.
              </p>

              <button
                onClick={() => navigate("/patient/doctors")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#2d5f41]"
              >
                Find a Doctor
                <ChevronRight size={18} />
              </button>
            </motion.section>

            <section className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Next appointment
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Upcoming visit
                  </h3>
                </div>

                <div className="rounded-2xl bg-[#e6f2e9] p-3 text-[#457D58]">
                  <CalendarDays size={22} />
                </div>
              </div>

              {nextAppointment ? (
                <div className="mt-6 rounded-2xl bg-[#f5f9f6] p-4">
                  <p className="font-bold text-slate-900">
                    {nextAppointment.doctor?.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {nextAppointment.doctor?.email}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(nextAppointment.slot?.startTime)}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {formatTime(nextAppointment.slot?.startTime)}
                    </span>
                  </div>

                  <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    {nextAppointment.status}
                  </span>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-[#f5f9f6] p-5 text-center">
                  <CalendarDays
                    className="mx-auto text-slate-300"
                    size={32}
                  />
                  <p className="mt-3 font-semibold text-slate-700">
                    No upcoming appointments
                  </p>
                </div>
              )}
            </section>
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Upcoming",
                value: confirmedAppointments.length,
                icon: CalendarDays,
              },
              {
                label: "Completed",
                value: completedCount,
                icon: HeartPulse,
              },
              {
                label: "Doctors",
                value: doctors.length,
                icon: Stethoscope,
              },
              {
                label: "Unread alerts",
                value: unreadCount,
                icon: Bell,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {value}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#e7f1e9] p-3 text-[#457D58]">
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#457D58]">
                  Available specialists
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  Recommended doctors
                </h3>
              </div>

              <button
                onClick={() => navigate("/patient/doctors")}
                className="text-sm font-semibold text-[#457D58]"
              >
                View all
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <article
                  key={doctor.id}
                  className="group rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dcecdf] text-[#457D58]">
                      <Stethoscope size={24} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">
                        {doctor.name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {doctor.doctorProfile?.specialization ||
                          "Specialist"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                    <span>
                      {doctor.doctorProfile?.experienceYears || 0} years
                    </span>

                    <span className="font-bold text-[#457D58]">
                      ₹{doctor.doctorProfile?.consultationFee || 0}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/patient/doctors/${doctor.id}`)
                    }
                    className="mt-5 w-full rounded-2xl bg-[#f0f6f2] py-3 font-semibold text-[#457D58] transition group-hover:bg-[#457D58] group-hover:text-white"
                  >
                    View Availability
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default PatientDashboard;
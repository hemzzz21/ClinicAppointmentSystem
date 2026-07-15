import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonStats, SkeletonCard } from "../../components/ui/Skeleton";

import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../context/useNotifications";
import { getDoctors } from "../../services/doctor.service";
import { getMyAppointments } from "../../services/appointment.service";
import { formatDate, formatTime } from "../../utils/format";

function PatientDashboard() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [doctorResponse, appointmentResponse] = await Promise.all([
        getDoctors({ page: 1, limit: 3 }),
        getMyAppointments(),
      ]);

      setDoctors(doctorResponse.data?.doctors || []);
      setAppointments(appointmentResponse.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  const confirmedAppointments = useMemo(
    () => appointments.filter((a) => a.status === "CONFIRMED"),
    [appointments]
  );

  const completedCount = useMemo(
    () => appointments.filter((a) => a.status === "COMPLETED").length,
    [appointments]
  );

  const nextAppointment = confirmedAppointments
    .slice()
    .sort(
      (a, b) => new Date(a.slot?.startTime) - new Date(b.slot?.startTime)
    )[0];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Patient Dashboard"
        title={`Hello, ${user?.name?.split(" ")[0] || "Patient"} 👋`}
        subtitle="Manage your appointments and find the right doctor."
      />

      {loading ? (
        <div className="mt-8 space-y-8">
          <SkeletonStats />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
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
                Explore specialists, check live availability, and reserve your preferred slot instantly.
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
                  <p className="text-sm text-slate-500">Next appointment</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">Upcoming visit</h3>
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
                      <CalendarDays size={16} />
                      {formatTime(nextAppointment.slot?.startTime)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-[#f5f9f6] p-5 text-center">
                  <CalendarDays className="mx-auto text-slate-300" size={32} />
                  <p className="mt-3 font-semibold text-slate-700">
                    No upcoming appointments
                  </p>
                </div>
              )}
            </section>
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Upcoming" value={confirmedAppointments.length} icon={CalendarDays} />
            <StatCard label="Completed" value={completedCount} icon={HeartPulse} delay={0.05} />
            <StatCard label="Doctors" value={doctors.length} icon={Stethoscope} delay={0.1} />
            <StatCard label="Unread alerts" value={unreadCount} icon={Bell} delay={0.15} />
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#457D58]">Available specialists</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">Recommended doctors</h3>
              </div>
              <button
                onClick={() => navigate("/patient/doctors")}
                className="text-sm font-semibold text-[#457D58]"
              >
                View all
              </button>
            </div>

            {doctors.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  icon={Stethoscope}
                  title="No doctors available"
                  description="Check back later for new specialists."
                />
              </div>
            ) : (
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
                        <h4 className="font-bold text-slate-900">{doctor.name}</h4>
                        <p className="text-sm text-slate-500">
                          {doctor.doctorProfile?.specialization || "Specialist"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                      <span>{doctor.doctorProfile?.experienceYears || 0} years</span>
                      <span className="font-bold text-[#457D58]">
                        ₹{doctor.doctorProfile?.consultationFee || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
                      className="mt-5 w-full rounded-2xl bg-[#f0f6f2] py-3 font-semibold text-[#457D58] transition group-hover:bg-[#457D58] group-hover:text-white"
                    >
                      View Availability
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default PatientDashboard;

import { useEffect, useState } from "react";
import { CalendarDays, CircleCheck as CheckCircle2, Circle as XCircle, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonStats } from "../../components/ui/Skeleton";

import { getDoctorStats, getMyAppointments } from "../../services/appointment.service";
import AppointmentCard from "../../components/appointments/AppointmentCard";

function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, apptRes] = await Promise.all([
        getDoctorStats(),
        getMyAppointments(),
      ]);
      setStats(statsRes.data);
      setAppointments(apptRes.data || []);
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

  const upcoming = appointments
    .filter((a) => a.status === "CONFIRMED")
    .sort((a, b) => new Date(a.slot?.startTime) - new Date(b.slot?.startTime))
    .slice(0, 4);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Doctor Dashboard"
        title="Practice Overview"
        subtitle="Your appointments and performance at a glance."
      />

      {loading ? (
        <div className="mt-8 space-y-8">
          <SkeletonStats />
        </div>
      ) : (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total appointments" value={stats?.totalAppointments ?? 0} icon={ClipboardList} />
            <StatCard label="Upcoming" value={stats?.upcomingAppointments ?? 0} icon={CalendarDays} delay={0.05} />
            <StatCard label="Completed" value={stats?.completedAppointments ?? 0} icon={CheckCircle2} delay={0.1} accent="#3b82f6" />
            <StatCard label="No-shows" value={stats?.noShowAppointments ?? 0} icon={XCircle} delay={0.15} accent="#ef4444" />
          </section>

          <section className="mt-8">
            <h3 className="text-2xl font-bold text-slate-900">Upcoming appointments</h3>
            {upcoming.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  icon={CalendarDays}
                  title="No upcoming appointments"
                  description="New confirmed bookings will appear here."
                />
              </div>
            ) : (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} viewer="doctor" />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default DoctorDashboard;

import { useEffect, useState } from "react";
import { CalendarDays, CircleCheck as CheckCircle2, ClipboardList, Stethoscope, UserRound, Circle as XCircle } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonStats, SkeletonCard } from "../../components/ui/Skeleton";
import Badge from "../../components/ui/Badge";

import { getAdminDashboard } from "../../services/admin.service";
import { formatDateTime } from "../../utils/format";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Dashboard"
        title="System Overview"
        subtitle="Monitor users, doctors, and appointments across the platform."
      />

      {loading ? (
        <div className="mt-8 space-y-8">
          <SkeletonStats />
          <div className="grid gap-5 md:grid-cols-2">
            {[0, 1].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total patients" value={data?.totalPatients ?? 0} icon={UserRound} />
            <StatCard label="Total doctors" value={data?.totalDoctors ?? 0} icon={Stethoscope} delay={0.05} />
            <StatCard label="Total appointments" value={data?.totalAppointments ?? 0} icon={ClipboardList} delay={0.1} />
            <StatCard label="Confirmed" value={data?.confirmedAppointments ?? 0} icon={CheckCircle2} delay={0.15} accent="#3b82f6" />
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Completed" value={data?.completedAppointments ?? 0} icon={CheckCircle2} accent="#3b82f6" />
            <StatCard label="Cancelled" value={data?.cancelledAppointments ?? 0} icon={XCircle} delay={0.05} accent="#ef4444" />
            <StatCard label="No-shows" value={data?.noShowAppointments ?? 0} icon={CalendarDays} delay={0.1} accent="#f59e0b" />
          </section>

          <section className="mt-8">
            <h3 className="text-2xl font-bold text-slate-900">Recent appointments</h3>
            {!data?.recentAppointments?.length ? (
              <div className="mt-5">
                <EmptyState
                  icon={CalendarDays}
                  title="No recent appointments"
                  description="Recent bookings will appear here."
                />
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {data.recentAppointments.map((a) => (
                  <article
                    key={a.id}
                    className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {a.patient?.name} → {a.doctor?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDateTime(a.createdAt)}
                      </p>
                    </div>
                    <Badge status={a.status} />
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

export default AdminDashboard;

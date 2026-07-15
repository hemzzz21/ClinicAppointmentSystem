import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";

import { getAdminAppointments } from "../../services/admin.service";
import { formatDate, formatTime } from "../../utils/format";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAdminAppointments();
      setAppointments(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAppointments();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin"
        title="Appointments"
        subtitle="All appointments booked across the platform."
      />

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ClipboardList}
            title="No appointments yet"
            description="Appointments will be listed here once patients start booking."
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-sm backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f5f9f6] text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Patient</th>
                  <th className="px-5 py-3 font-semibold">Doctor</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-[#f9fcfa]">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {a.patient?.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{a.doctor?.name}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(a.slot?.startTime)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatTime(a.slot?.startTime)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{a.type}</td>
                    <td className="px-5 py-4">
                      <Badge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminAppointments;

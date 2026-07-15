import { useEffect, useState } from "react";
import { ClipboardList, CircleCheck as CheckCircle2, Circle as XCircle } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";

import {
  getMyAppointments,
  updateAppointmentStatus,
} from "../../services/appointment.service";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "No-show", value: "NO_SHOW" },
];

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointments();
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

  const filtered = appointments.filter((a) =>
    filter === "all" ? true : a.status === filter
  );

  const handleStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateAppointmentStatus(id, status);
      toast.success(`Marked as ${status}`);
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Doctor"
        title="Appointments"
        subtitle="Manage your patient appointments and update their status."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.value
                ? "bg-[#457D58] text-white"
                : "bg-white/70 text-slate-600 hover:bg-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ClipboardList}
            title="No appointments"
            description="Appointments booked with you will show up here."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              viewer="doctor"
              actions={
                appointment.status === "CONFIRMED" && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={updatingId === appointment.id}
                      onClick={() => handleStatus(appointment.id, "COMPLETED")}
                    >
                      <CheckCircle2 size={16} />
                      Mark completed
                    </Button>
                    <Button
                      variant="dangerOutline"
                      size="sm"
                      loading={updatingId === appointment.id}
                      onClick={() => handleStatus(appointment.id, "NO_SHOW")}
                    >
                      <XCircle size={16} />
                      Mark no-show
                    </Button>
                  </>
                )
              }
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default DoctorAppointments;

import { useEffect, useState } from "react";
import { CalendarDays, Circle as XCircle } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { TextArea } from "../../components/ui/Form";

import { getMyAppointments, cancelAppointment } from "../../services/appointment.service";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelAppointment(cancelTarget.id, cancelReason);
      toast.success("Appointment cancelled");
      setCancelTarget(null);
      setCancelReason("");
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Patient"
        title="My Appointments"
        subtitle="View and manage your booked appointments."
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
            icon={CalendarDays}
            title="No appointments here"
            description="When you book appointments they will appear in this list."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              viewer="patient"
              actions={
                appointment.status === "CONFIRMED" && (
                  <Button
                    variant="dangerOutline"
                    size="sm"
                    onClick={() => setCancelTarget(appointment)}
                  >
                    <XCircle size={16} />
                    Cancel Appointment
                  </Button>
                )
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel appointment?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelTarget(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              loading={cancelling}
              onClick={handleCancel}
            >
              Confirm Cancel
            </Button>
          </>
        }
      >
        <p className="text-slate-600">
          This will release the booked slot back to the doctor. The action
          cannot be undone.
        </p>
        <div className="mt-4">
          <TextArea
            label="Reason (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            placeholder="Tell us why you're cancelling"
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default Appointments;

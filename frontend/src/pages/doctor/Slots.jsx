import { useEffect, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Form";
import { Skeleton } from "../../components/ui/Skeleton";

import {
  getDoctorSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} from "../../services/doctor.service";
import { formatDate, formatTime } from "../../utils/format";

const emptyForm = {
  slotDate: "",
  startTime: "",
  endTime: "",
};

function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const res = await getDoctorSlots();
      setSlots(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSlots();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (slot) => {
    const date = new Date(slot.slotDate).toISOString().slice(0, 10);
    setEditing(slot);
    setForm({
      slotDate: date,
      startTime: formatTime(slot.startTime),
      endTime: formatTime(slot.endTime),
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.slotDate || !form.startTime || !form.endTime) {
      toast.error("Fill in date, start and end time");
      return;
    }

    try {
      setSubmitting(true);
      if (editing) {
        await updateSlot(editing.id, form);
        toast.success("Slot updated");
      } else {
        await createSlot(form);
        toast.success("Slot created");
      }
      setModalOpen(false);
      loadSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save slot");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteSlot(deleteTarget.id);
      toast.success("Slot deleted");
      setDeleteTarget(null);
      loadSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Doctor"
        title="Availability Slots"
        subtitle="Create and manage your appointment availability."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add Slot
          </Button>
        }
      />

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={CalendarDays}
            title="No slots yet"
            description="Create availability slots so patients can book you."
            action={
              <Button onClick={openCreate}>
                <Plus size={16} />
                Add your first slot
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => (
            <article
              key={slot.id}
              className="rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <CalendarDays size={18} className="text-[#457D58]" />
                  {formatDate(slot.startTime)}
                </span>
                <Badge status={slot.status} />
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Clock3 size={16} />
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </p>

              {slot.status === "AVAILABLE" && (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(slot)}
                  >
                    <Pencil size={15} />
                    Edit
                  </Button>
                  <Button
                    variant="dangerOutline"
                    size="sm"
                    onClick={() => setDeleteTarget(slot)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </Button>
                </div>
              )}
              {slot.status === "BOOKED" && (
                <p className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600">
                  Booked — cannot edit or delete
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit slot" : "Create slot"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={submitting} onClick={handleSubmit}>
              {editing ? "Save changes" : "Create slot"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={form.slotDate}
            onChange={(e) => setForm({ ...form, slotDate: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start time"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <Input
              label="End time"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete slot?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-slate-600">
          This slot will be permanently removed. Patients won't be able to book it.
        </p>
      </Modal>
    </DashboardLayout>
  );
}

export default Slots;

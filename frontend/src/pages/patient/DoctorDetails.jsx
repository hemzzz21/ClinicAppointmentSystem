import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Stethoscope,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import { TextArea } from "../../components/ui/Form";

import {
  getDoctorById,
  getDoctorAvailableSlots,
} from "../../services/doctor.service";
import { bookAppointment } from "../../services/appointment.service";
import { formatDate, formatTime } from "../../utils/format";

function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [type, setType] = useState("OFFLINE");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorResponse, slotResponse] = await Promise.all([
          getDoctorById(doctorId),
          getDoctorAvailableSlots(doctorId),
        ]);
        setDoctor(doctorResponse.data);
        setSlots(slotResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load doctor");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [doctorId]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Select an appointment slot");
      return;
    }
    if (!reason.trim()) {
      toast.error("Enter the reason for consultation");
      return;
    }

    try {
      setBooking(true);
      await bookAppointment({
        slotId: selectedSlot.id,
        reason,
        type,
        notes: "",
      });
      toast.success("Appointment booked successfully");
      navigate("/patient/appointments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Spinner label="Loading doctor details..." />
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={Stethoscope}
          title="Doctor not found"
          description="This doctor may no longer be available."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        backTo="/patient/doctors"
        eyebrow="Book appointment"
        title={doctor.name}
        subtitle={doctor.doctorProfile?.specialization}
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[30px] border border-white/70 bg-white/75 p-7 shadow-sm backdrop-blur">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e5f1e8] text-[#457D58]">
            <Stethoscope size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">{doctor.name}</h1>
          <p className="mt-2 font-semibold text-[#457D58]">
            {doctor.doctorProfile?.specialization}
          </p>
          <p className="mt-5 leading-7 text-slate-600">
            {doctor.doctorProfile?.bio || "Experienced healthcare specialist."}
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p>
              Qualification:{" "}
              <strong className="text-slate-800">
                {doctor.doctorProfile?.qualification || "Not provided"}
              </strong>
            </p>
            <p>
              Experience:{" "}
              <strong className="text-slate-800">
                {doctor.doctorProfile?.experienceYears || 0} years
              </strong>
            </p>
            <p>
              Consultation fee:{" "}
              <strong className="text-[#457D58]">
                ₹{doctor.doctorProfile?.consultationFee || 0}
              </strong>
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={17} />
              {doctor.doctorProfile?.clinicLocation || "Clinic location unavailable"}
            </p>
          </div>
        </article>

        <article className="rounded-[30px] border border-white/70 bg-white/75 p-7 shadow-sm backdrop-blur">
          <h2 className="text-2xl font-bold text-slate-900">Available appointment slots</h2>
          <p className="mt-2 text-slate-500">
            Select a suitable slot and enter the consultation reason.
          </p>

          {slots.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={CalendarDays}
                title="No available slots"
                description="This doctor has no open slots right now."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {slots.map((slot) => {
                const selected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#457D58] bg-[#e9f3eb] ring-2 ring-[#457D58]/15"
                        : "border-slate-200 hover:border-[#457D58]/50"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold text-slate-800">
                      <CalendarDays size={17} />
                      {formatDate(slot.startTime)}
                    </span>
                    <span className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={16} />
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </span>
                    <div className="mt-2">
                      <Badge status={slot.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-7">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Consultation type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "OFFLINE", label: "In-clinic", icon: MapPin },
                { value: "ONLINE", label: "Online", icon: Video },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold transition ${
                    type === value
                      ? "border-[#457D58] bg-[#e9f3eb] text-[#457D58]"
                      : "border-slate-200 text-slate-600 hover:border-[#457D58]/50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <TextArea
              label="Reason for consultation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Describe your concern"
            />
          </div>

          <Button
            onClick={handleBooking}
            loading={booking}
            disabled={slots.length === 0}
            className="mt-6 w-full"
            size="lg"
          >
            Confirm Appointment
          </Button>
        </article>
      </section>
    </DashboardLayout>
  );
}

export default DoctorDetails;

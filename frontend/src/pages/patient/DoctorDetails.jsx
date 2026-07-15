import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getDoctorById,
  getDoctorAvailableSlots,
} from "../../services/doctor.service";
import { bookAppointment } from "../../services/appointment.service";

function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
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
        toast.error(
          error.response?.data?.message || "Unable to load doctor"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [doctorId]);

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (value) =>
    new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

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
        type: "OFFLINE",
        notes: "",
      });

      toast.success("Appointment booked successfully");
      navigate("/patient/appointments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Booking failed"
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8f5]">
        Loading doctor details...
      </main>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f4f8f5] px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/patient/doctors")}
          className="flex items-center gap-2 font-semibold text-[#457D58]"
        >
          <ArrowLeft size={18} />
          Back to doctors
        </button>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-[30px] bg-white p-7 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e5f1e8] text-[#457D58]">
              <Stethoscope size={34} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              {doctor.name}
            </h1>

            <p className="mt-2 font-semibold text-[#457D58]">
              {doctor.doctorProfile?.specialization}
            </p>

            <p className="mt-5 leading-7 text-slate-600">
              {doctor.doctorProfile?.bio ||
                "Experienced healthcare specialist."}
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
                {doctor.doctorProfile?.clinicLocation ||
                  "Clinic location unavailable"}
              </p>
            </div>
          </article>

          <article className="rounded-[30px] bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Available appointment slots
            </h2>

            <p className="mt-2 text-slate-500">
              Select a suitable slot and enter the consultation reason.
            </p>

            {slots.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-[#f5f9f6] p-8 text-center">
                No available slots for this doctor.
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
                        {formatTime(slot.startTime)} –{" "}
                        {formatTime(slot.endTime)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reason for consultation
              </label>

              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                placeholder="Describe your concern"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#457D58]"
              />
            </div>

            <button
              onClick={handleBooking}
              disabled={booking || slots.length === 0}
              className="mt-6 w-full rounded-2xl bg-[#457D58] py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {booking ? "Booking..." : "Confirm Appointment"}
            </button>
          </article>
        </section>
      </div>
    </main>
  );
}

export default DoctorDetails;
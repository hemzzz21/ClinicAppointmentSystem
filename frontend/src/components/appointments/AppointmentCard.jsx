import { CalendarDays, Clock3, Video, MapPin, UserRound } from "lucide-react";

import Badge from "../ui/Badge";
import { formatDate, formatTime } from "../../utils/format";

function AppointmentCard({ appointment, actions, viewer = "patient" }) {
  const otherParty =
    viewer === "patient" ? appointment.doctor : appointment.patient;

  return (
    <article className="group rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dcecdf] text-[#457D58]">
            <UserRound size={22} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{otherParty?.name}</h4>
            <p className="text-sm text-slate-500">{otherParty?.email}</p>
          </div>
        </div>
        <Badge status={appointment.status} />
      </div>

      <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <CalendarDays size={16} />
          {formatDate(appointment.slot?.startTime)}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 size={16} />
          {formatTime(appointment.slot?.startTime)} –{" "}
          {formatTime(appointment.slot?.endTime)}
        </span>
        <span className="flex items-center gap-2">
          {appointment.type === "ONLINE" ? <Video size={16} /> : <MapPin size={16} />}
          {appointment.type === "ONLINE"
            ? "Online consultation"
            : "In-clinic visit"}
        </span>
        {appointment.reason && (
          <span className="truncate">
            Reason: {appointment.reason}
          </span>
        )}
      </div>

      {appointment.notes && (
        <p className="mt-3 rounded-2xl bg-[#f5f9f6] p-3 text-sm text-slate-600">
          {appointment.notes}
        </p>
      )}

      {appointment.cancelReason && (
        <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
          Cancelled: {appointment.cancelReason}
        </p>
      )}

      {actions && (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      )}
    </article>
  );
}

export default AppointmentCard;

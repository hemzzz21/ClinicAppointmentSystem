import { CalendarDays, LayoutDashboard, Bell, Users, UserRound, ClipboardList, CirclePlus as PlusCircle, Search, Stethoscope } from "lucide-react";

export const ROLE_NAV = {
  PATIENT: [
    { to: "/patient", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/patient/doctors", label: "Find Doctors", icon: Search },
    { to: "/patient/appointments", label: "My Appointments", icon: CalendarDays },
    { to: "/patient/notifications", label: "Notifications", icon: Bell },
    { to: "/patient/profile", label: "Profile", icon: UserRound },
  ],
  DOCTOR: [
    { to: "/doctor", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/doctor/appointments", label: "Appointments", icon: ClipboardList },
    { to: "/doctor/slots", label: "Availability Slots", icon: CalendarDays },
    { to: "/doctor/notifications", label: "Notifications", icon: Bell },
    { to: "/doctor/profile", label: "Profile", icon: UserRound },
  ],
  ADMIN: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/appointments", label: "Appointments", icon: ClipboardList },
    { to: "/admin/doctors/new", label: "Create Doctor", icon: PlusCircle },
    { to: "/admin/profile", label: "Profile", icon: UserRound },
  ],
};

export const ROLE_LABEL = {
  PATIENT: "Patient Portal",
  DOCTOR: "Doctor Portal",
  ADMIN: "Admin Portal",
};

export const ROLE_ICON = {
  PATIENT: UserRound,
  DOCTOR: Stethoscope,
  ADMIN: Users,
};

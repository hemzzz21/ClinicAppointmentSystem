import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/shared/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import PatientDashboard from "../pages/patient/Dashboard";
import Doctors from "../pages/patient/Doctors";
import DoctorDetails from "../pages/patient/DoctorDetails";
import PatientAppointments from "../pages/patient/Appointments";
import NotificationsPage from "../pages/shared/Notifications";
import Profile from "../pages/shared/Profile";

import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorSlots from "../pages/doctor/Slots";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminAppointments from "../pages/admin/Appointments";
import CreateDoctor from "../pages/admin/CreateDoctor";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient pages */}
        <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/doctors" element={<Doctors />} />
          <Route path="/patient/doctors/:doctorId" element={<DoctorDetails />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route
            path="/patient/notifications"
            element={<NotificationsPage role="Patient" />}
          />
          <Route path="/patient/profile" element={<Profile role="Patient" />} />
        </Route>

        {/* Doctor pages */}
        <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/slots" element={<DoctorSlots />} />
          <Route
            path="/doctor/notifications"
            element={<NotificationsPage role="Doctor" />}
          />
          <Route path="/doctor/profile" element={<Profile role="Doctor" />} />
        </Route>

        {/* Admin pages */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/doctors/new" element={<CreateDoctor />} />
          <Route path="/admin/profile" element={<Profile role="Admin" />} />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

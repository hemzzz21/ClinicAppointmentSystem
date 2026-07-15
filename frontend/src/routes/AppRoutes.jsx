import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/shared/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import PatientDashboard from "../pages/patient/Dashboard";
import Doctors from "../pages/patient/Doctors";
import DoctorDetails from "../pages/patient/DoctorDetails";

import DoctorDashboard from "../pages/doctor/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

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
          <Route
            path="/patient/doctors/:doctorId"
            element={<DoctorDetails />}
          />
        </Route>

        {/* Doctor pages */}
        <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        {/* Admin pages */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
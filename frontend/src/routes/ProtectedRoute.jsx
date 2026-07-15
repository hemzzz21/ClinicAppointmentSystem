import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#457D58]/20 border-t-[#457D58]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = String(user.role || "").toUpperCase();
  const permittedRoles = allowedRoles.map((role) =>
    String(role).toUpperCase()
  );

  if (
    permittedRoles.length > 0 &&
    !permittedRoles.includes(currentRole)
  ) {
    if (currentRole === "PATIENT") {
      return <Navigate to="/patient" replace />;
    }

    if (currentRole === "DOCTOR") {
      return <Navigate to="/doctor" replace />;
    }

    if (currentRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
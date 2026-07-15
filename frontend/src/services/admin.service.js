import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const getAdminAppointments = async () => {
  const response = await api.get("/admin/appointments");
  return response.data;
};

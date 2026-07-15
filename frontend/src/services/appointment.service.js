import api from "./api";

export const getMyAppointments = async () => {
  const response = await api.get("/appointments/my");
  return response.data;
};

export const bookAppointment = async (data) => {
  const response = await api.post("/appointments/book", data);
  return response.data;
};

export const cancelAppointment = async (
  appointmentId,
  cancelReason
) => {
  const response = await api.patch(
    `/appointments/${appointmentId}/cancel`,
    { cancelReason }
  );

  return response.data;
};
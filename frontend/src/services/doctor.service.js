import api from "./api";

export const getDoctors = async (params = {}) => {
  const response = await api.get("/doctors", { params });
  return response.data;
};

export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const getDoctorAvailableSlots = async (doctorId) => {
  const response = await api.get(
    `/appointments/available-slots/${doctorId}`
  );

  return response.data;
};
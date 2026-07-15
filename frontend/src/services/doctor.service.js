import api from "./api";

export const getDoctors = async (params = {}) => {
  const response = await api.get("/doctors", { params });
  return response.data;
};

export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const createDoctor = async (data) => {
  const response = await api.post("/doctors", data);
  return response.data;
};

export const getDoctorSlots = async () => {
  const response = await api.get("/doctors/slots/me");
  return response.data;
};

export const createSlot = async (data) => {
  const response = await api.post("/doctors/slots", data);
  return response.data;
};

export const updateSlot = async (slotId, data) => {
  const response = await api.put(`/doctors/slots/${slotId}`, data);
  return response.data;
};

export const deleteSlot = async (slotId) => {
  const response = await api.delete(`/doctors/slots/${slotId}`);
  return response.data;
};

export const getDoctorAvailableSlots = async (doctorId) => {
  const response = await api.get(
    `/appointments/available-slots/${doctorId}`
  );

  return response.data;
};

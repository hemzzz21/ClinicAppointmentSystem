import api from "./api";

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await api.post("/uploads/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

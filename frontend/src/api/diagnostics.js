import api from "./Index";

export const analyzeMedicalImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await api.post("/diagnostics/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

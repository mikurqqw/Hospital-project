import api from "./Index";

export const checkSymptoms = async (symptomsList, additionalInfo = "") => {
  const response = await api.post("/symptoms/check", {
    symptoms: symptomsList,
    additional_info: additionalInfo,
  });
  return response.data;
};

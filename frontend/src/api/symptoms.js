import api from "./index";

export const checkSymptoms = async (symptomsList, additionalInfo = "") => {
  const response = await api.post("/symptoms/check", {
    symptoms: symptomsList,
    additional_info: additionalInfo,
  });
  return response.data;
};

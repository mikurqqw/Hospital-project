import api from "./index";

export const getHealthData = async () => {
  try {
    // ВАЖНО: слэш на конце обязателен для FastAPI
    const response = await api.get("/health/");
    return response.data;
  } catch (error) {
    console.error("Ошибка API при получении данных здоровья:", error);
    throw error;
  }
};

export const saveHealthData = async (data) => {
  try {
    // ВАЖНО: слэш на конце обязателен
    const response = await api.post("/health/", data);
    return response.data;
  } catch (error) {
    console.error("Ошибка API при сохранении данных здоровья:", error);
    throw error;
  }
};

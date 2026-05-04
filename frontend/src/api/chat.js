import api from "./index";

export const getChatHistory = async () => {
  const response = await api.get("/chat/history");
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await api.post("/chat/message", { message });
  return response.data;
};

export const clearChatHistory = async () => {
  const response = await api.delete("/chat/history");
  return response.data;
};

import api from "./index";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (full_name, email, password) => {
  const response = await api.post("/auth/register", {
    full_name,
    email,
    password,
  });
  return response.data;
};

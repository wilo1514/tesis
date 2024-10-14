import axios from "axios";

const authClient = axios.create({
  baseURL: "http://localhost:3000", // Puerto 3000 para el servicio de autenticación
});

export const identifyLogin = async () => {
  const response = await authClient.get("/api/auth/");
  return response.data;
};

export const login = async (email, password) => {
  const response = await authClient.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await authClient.post("/api/auth/register", userData);
  return response.data;
};

export default {
  identifyLogin,
  login,
  registerUser,
};

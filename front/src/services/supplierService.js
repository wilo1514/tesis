import axios from "axios";
import { getAuthData } from "./auth";

const supplierClient = axios.create({
  baseURL: "http://localhost:3003", // Puerto 3003 para el servicio de proveedores
});

export const getSuppliers = async () => {
  const { token } = getAuthData();
  const response = await supplierClient.get("/suppliers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Otros endpoints de proveedores

export default {
  getSuppliers,
  // Otros endpoints de proveedores
};

import axios from "axios";
import { getAuthData } from "./auth"; // Autenticación compartida

const supplierClient = axios.create({
  baseURL: "http://localhost:3003/api", // Puerto 3003 para el servicio de proveedores
});

// Obtener todos los proveedores
export const getSuppliers = async () => {
  const { token } = getAuthData();
  const response = await supplierClient.get("/suppliers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Crear un nuevo proveedor
export const createSupplier = async (supplierData) => {
  const { token } = getAuthData();
  const response = await supplierClient.post("/suppliers", supplierData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Obtener proveedor por ID
export const getSupplierById = async (supplierId) => {
  const { token } = getAuthData();
  const response = await supplierClient.get(`/suppliers/${supplierId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Editar proveedor por ID
export const updateSupplier = async (supplierId, supplierData) => {
  const { token } = getAuthData();
  const response = await supplierClient.put(`/suppliers/${supplierId}`, supplierData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Eliminar proveedor por ID
export const deleteSupplier = async (supplierId) => {
  const { token } = getAuthData();
  const response = await supplierClient.delete(`/suppliers/${supplierId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};

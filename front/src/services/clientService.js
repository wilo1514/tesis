import axios from "axios";
import { getAuthData } from "./auth"; // Autenticación compartida

const clientClient = axios.create({
  baseURL: "http://localhost:3005/api", // Puerto 3005 para el servicio de clientes
});

// Obtener todos los clientes
export const getClients = async () => {
  const { token } = getAuthData();
  const response = await clientClient.get("/clients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Obtener cliente por razón social
export const getClientByRazonSocial = async (razonSocial) => {
  const { token } = getAuthData();
  const response = await clientClient.get(`/clients/razonSocial/${razonSocial}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Obtener cliente por identificación
export const getClientByIdentificacion = async (identificacion) => {
  const { token } = getAuthData();
  const response = await clientClient.get(`/clients/identificacion/${identificacion}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Obtener cliente por ID
export const getClientById = async (clientId) => {
  const { token } = getAuthData();
  const response = await clientClient.get(`/clients/${clientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Editar cliente por ID
export const updateClient = async (clientId, clientData) => {
  const { token } = getAuthData();
  const response = await clientClient.put(`/clients/${clientId}`, clientData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Eliminar cliente por ID
export const deleteClient = async (clientId) => {
  const { token } = getAuthData();
  const response = await clientClient.delete(`/clients/${clientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getClients,
  getClientByRazonSocial,
  getClientByIdentificacion,
  getClientById,
  updateClient,
  deleteClient,
};

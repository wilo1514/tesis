import axios from "axios";
import { getAuthData } from "./auth"; // Autenticación compartida

const codeClient = axios.create({
    baseURL: "http://localhost:4000/api", // Ajusta la URL base según el puerto del servicio
});

// Obtener todos los códigos
export const getCodes = async () => {
    const { token } = getAuthData();
    const response = await codeClient.get("/retentioncode", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Crear un nuevo código
export const createCode = async (codeData) => {
    const { token } = getAuthData();
    const response = await codeClient.post("/codes", codeData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Obtener código por ID
export const getCodeById = async (codeId) => {
    const { token } = getAuthData();
    const response = await codeClient.get(`/codes/${codeId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Editar código por ID
export const updateCode = async (codeId, codeData) => {
    const { token } = getAuthData();
    const response = await codeClient.put(`/codes/${codeId}`, codeData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Eliminar código por ID
export const deleteCode = async (codeId) => {
    const { token } = getAuthData();
    const response = await codeClient.delete(`/codes/${codeId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Buscar código por tipo
export const getCodeByType = async (type) => {
    const { token } = getAuthData();
    const response = await codeClient.get(`/codes/type/${type}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Buscar código por código específico
export const getCodeByCodigo = async (codigo) => {
    const { token } = getAuthData();
    const response = await codeClient.get(`/codes/codigo/${codigo}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    getCodes,
    createCode,
    getCodeById,
    updateCode,
    deleteCode,
    getCodeByType,
    getCodeByCodigo,
};

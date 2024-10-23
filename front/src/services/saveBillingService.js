import axios from "axios";
import { getAuthData } from "./auth"; // Autenticación compartida

const billingClient = axios.create({
    baseURL: "http://localhost:3011/api/savebilling", // Puerto 3011 para el servicio de facturación
});

// Obtener todas las facturas
export const getBillings = async () => {
    const { token } = getAuthData();
    const response = await billingClient.get("/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Crear una nueva factura|
export const createBilling = async (billingData) => {
    const { token } = getAuthData();
    const response = await billingClient.post("/", billingData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Obtener factura por número de comprobante
export const getBillingByNumeroComprobante = async (numeroComprobante) => {
    const { token } = getAuthData();
    const response = await billingClient.get(`/numeroComprobante/${numeroComprobante}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener factura por RUC
export const getBillingByRUC = async (ruc) => {
    const { token } = getAuthData();
    const response = await billingClient.get(`/ruc/${ruc}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener factura por ID
export const getBillingById = async (billingId) => {
    const { token } = getAuthData();
    const response = await billingClient.get(`/${billingId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Eliminar factura por ID
export const deleteBilling = async (billingId) => {
    const { token } = getAuthData();
    const response = await billingClient.delete(`/${billingId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener detalles de una factura por número de comprobante
export const getDetailsByNumeroComprobante = async (numeroComprobante) => {
    const { token } = getAuthData();
    const response = await billingClient.get(`/detalles/${numeroComprobante}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    getBillings,
    createBilling,
    getBillingByNumeroComprobante,
    getBillingByRUC,
    getBillingById,
    deleteBilling,
    getDetailsByNumeroComprobante,
};

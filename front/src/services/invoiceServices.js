import axios from 'axios';
import { getAuthData } from './auth'; // Asegúrate de que tienes un servicio de autenticación

const invoiceClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Cambia la URL base si es necesario
});

// Obtener todas las facturas
export const getInvoices = async () => {
    const { token } = getAuthData();
    const response = await invoiceClient.get('/invoices', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Crear y enviar una nueva factura
export const createAndSendInvoice = async (invoiceData) => {
    const { token } = getAuthData();
    const response = await invoiceClient.post('/invoices', invoiceData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Reenviar facturas pendientes
export const resendPendingInvoices = async () => {
    const { token } = getAuthData();
    const response = await invoiceClient.post('/invoices/reenviar-pendientes', null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    getInvoices,
    createAndSendInvoice,
    resendPendingInvoices,
};

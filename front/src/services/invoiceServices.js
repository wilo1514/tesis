import axios from 'axios';
import {getAuthData} from './auth'; // Asegúrate de que tienes un servicio de autenticación

const invoiceClient = axios.create({
    baseURL: 'http://localhost:3001/api', // Cambia la URL base si es necesario
});

// Obtener todas las facturas
export const getInvoices = async () => {
    const {token} = getAuthData();
    const response = await invoiceClient.get('/invoices', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Crear y enviar una nueva factura
export const createAndSendInvoice = async (invoiceData) => {
    const {token} = getAuthData();
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
    const {token} = getAuthData();
    const response = await invoiceClient.post('/invoices/reenviar-pendientes', null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const getInvoicesPorPuntoEmision = async (ptoEmi) => {
    const { token } = getAuthData();

    // Verificar si se pasa el punto de emisión
    if (!ptoEmi) {
        throw new Error('El punto de emisión es requerido.');
    }

    try {
        // Hacemos la solicitud a la API pasando el punto de emisión como parámetro de consulta
        const response = await invoiceClient.get('/invoices', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                ptoEmi: ptoEmi // Enviamos el punto de emisión como un parámetro
            },
        });

        return response.data; // Retornamos los datos filtrados por punto de emisión
    } catch (error) {
        console.error('Error al obtener facturas por punto de emisión:', error);
        throw error;
    }
};


export default {
    getInvoices,
    createAndSendInvoice,
    resendPendingInvoices,
    getInvoicesPorPuntoEmision
};

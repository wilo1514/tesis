import axios from "axios";
import { getAuthData } from "./auth"; // Autenticación compartida

const productClient = axios.create({
    baseURL: "http://localhost:3006/api", // Asegúrate de que este puerto es correcto para el servicio de productos
});

// Obtener todos los productos
export const getProducts = async () => {
    const { token } = getAuthData();
    const response = await productClient.get("/products", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
    const { token } = getAuthData();
    const response = await productClient.post("/products", productData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Obtener producto por descripción
export const getProductByDescripcion = async (descripcion) => {
    const { token } = getAuthData();
    const response = await productClient.get(`/products/descripcion/${descripcion}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener producto por código principal
export const getProductByCodigoPrincipal = async (codigoPrincipal) => {
    const { token } = getAuthData();
    const response = await productClient.get(`/products/codigoPrincipal/${codigoPrincipal}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener producto por ID
export const getProductById = async (productId) => {
    const { token } = getAuthData();
    const response = await productClient.get(`/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Editar producto por ID
export const updateProduct = async (productId, productData) => {
    const { token } = getAuthData();
    const response = await productClient.put(`/products/${productId}`, productData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Eliminar producto por ID
export const deleteProduct = async (productId) => {
    const { token } = getAuthData();
    const response = await productClient.delete(`/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    getProducts,
    getProductByDescripcion,
    getProductByCodigoPrincipal,
    getProductById,
    updateProduct,
    deleteProduct,
};

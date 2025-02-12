import axios from "axios";
import {getAuthData} from "./auth"; // Autenticación compartida

const codeClient = axios.create({
    baseURL: "http://localhost:3008/api", // Ajusta la URL base según el puerto del servicio
});


// Crear un nuevo código
export const createRetencion = async (codeData) => {

    console.log("amor estoy en el servicio", codeData)

   const {token} = getAuthData();
    const response = await codeClient.post("/retentions", codeData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};


export default {
    createRetencion,
};

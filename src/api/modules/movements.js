import { getJWT } from "../../utils/localStorage"
import { apiHttp } from "../axiosApi"

export const getMovementsAPI = (pagination) => apiHttp("GET", `/v1/client/movement`, null, pagination)

export const createTransferAPI = async (dataTransfer) => {
    const token = getJWT();
    if (!token) {
        console.error("Error: No hay JWT disponible.");
        return null;
    }

    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await apiHttp("POST", "/v1/client/movement", dataTransfer, headers);
        console.log("Respuesta completa de createTransferAPI:", response);
        return response.data ?? response.message;
    } catch (error) {
        console.error("Error creando transferencia:", error);
        return null;
    }
}
  
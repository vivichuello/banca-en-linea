import { apiHttp } from "../axiosApi"
import { getJWT } from "../../utils/localStorage"

export const loginAPI = (loginValues) => apiHttp("POST", `/v1/public/client/user/login`, loginValues)

export const whoAmIAPI = async () => {
    const token = getJWT();
    if (!token) {
        console.error("Error: No hay JWT disponible.");
        return null;
    }

    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await apiHttp("GET", "/v1/client/user/whoami", {}, headers);
        console.log("Respuesta completa de whoAmIAPI:", response);
        if (response.data) {
            console.log("Número de cuenta recibido:", response.data.account_number);
        } else {
            console.error("Error: No se encontró 'data' en la respuesta.");
        }
        return response.data ?? null;
    } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
        return null;
    }
};

export const registerAPI = (registrValues) => apiHttp("POST", `/v1/public/client/user/register`, registrValues)


export const getBalanceAPI = async () => {
    const token = getJWT(); // Obtener el JWT almacenado en localStorage
    if (!token) {
        console.error("Error: No hay JWT disponible.");
        return null;
    }

    const headers = {
        Authorization: `Bearer ${token}` // Enviar el JWT en la cabecera correctamente
    };

    try {
        const response = await apiHttp("GET", "/v1/client/user/balance", {}, headers);
        console.log("Respuesta completa de getBalanceAPI:", response); // Depuración
        return response.data?.balance ?? null; // Devuelve el saldo o null si no existe
    } catch (error) {
        console.error("Error obteniendo el saldo:", error);
        return null;
    }
};

export const findUserByAccountNumberAPI = async (accountNumber) => {
    const token = getJWT(); // Obtener el JWT almacenado en localStorage
    if (!token) {
        console.error("Error: No hay JWT disponible.");
        return null;
    }

    const headers = {
        Authorization: `Bearer ${token}` // Enviar el JWT en la cabecera correctamente
    };

    try {
        const response = await apiHttp("GET", `/v1/client/user/account/${accountNumber}`, {}, headers);
        console.log("Respuesta completa de getUserByAccountNumberAPI:", response); // Depuración
        return response.data ?? null; // Devuelve datos user o null si no existe
    } catch (error) {
        console.error("Error encontrando usuario por numero de cuenta:", error);
        return null;
    }
}
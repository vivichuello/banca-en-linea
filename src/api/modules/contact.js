import { apiHttp } from "../axiosApi";

//  Crear un contacto (requiere body)
export const createContactAPI = (createContactValues) => 
    apiHttp("POST", `/v1/client/contact`, createContactValues);

//  Actualizar un contacto (requiere id en la URL y body)
export const updateContactAPI = (contactId, updateContactValues) => 
    apiHttp("PATCH", `/v1/client/contact/${contactId}`, updateContactValues);

//  Eliminar un contacto (requiere id en la URL)
export const deleteContactAPI = (contactId) => 
    apiHttp("DELETE", `/v1/client/contact/${contactId}`);

//  Obtener un contacto específico (requiere id en la URL)
export const getOneContactAPI = (contactId) => 
    apiHttp("GET", `/v1/client/contact/${contactId}`);

//  Obtener lista de contactos con paginación (page dinámico, limit fijo en 10)
export const getContactsListAPI = (page = 1) => 
    apiHttp("GET", `/v1/client/contact?page=${page}&limit=10`);

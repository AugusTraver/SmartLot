import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const GARAGES_TTL_MS = 5 * 60 * 1000;
const OCUPACION_TTL_MS = 15 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateGaragesDependencies = () => {
    invalidateByPrefix('garages:');
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
    invalidateByPrefix('reservas:disponibilidad:');
};

const GaragesGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/garage';

    try {

        return await getFromCache(
            'garages:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: GARAGES_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const GaragesGetOcupacionReserva = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/garage/ocupacion_reserva/' + id;

    try {

        return await getFromCache(
            'garages:ocupacion-reserva:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: OCUPACION_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const GaragesGetOcupacionNoReserva = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/garage/ocupacion_no_reserva/' + id;

    try {

        return await getFromCache(
            'garages:ocupacion-no-reserva:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: OCUPACION_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const GaragesGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/garage/' + id;

    try {

        return await getFromCache(
            'garages:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: GARAGES_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const GaragesCreate = async (garage) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/garage';

    try {

        const response = await apiClient.post(url, garage);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateGaragesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        returnObject.datos = error.response?.data || { message: error.message };
        return returnObject;
    }
};



const GaragesUpdate = async (id, garage) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/garage/' + id;

    try {

        const response = await apiClient.put(url, garage);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateGaragesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        returnObject.datos = error.response?.data || { message: error.message };
        return returnObject;
    }
};



const GaragesDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/garage/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateGaragesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    GaragesGetAll,
    GaragesGetOcupacionReserva,
    GaragesGetOcupacionNoReserva,
    GaragesGetById,
    GaragesCreate,
    GaragesUpdate,
    GaragesDelete
};

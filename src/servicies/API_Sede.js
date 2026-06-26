import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const SEDES_TTL_MS = 10 * 60 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateSedesDependencies = () => {
    invalidateByPrefix('sedes:');
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('garages:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
};

const SedesGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/sede';

    try {

        return await getFromCache(
            'sedes:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: SEDES_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const SedesGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/sede/' + id;

    try {

        return await getFromCache(
            'sedes:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: SEDES_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const SedesCreate = async (sede) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/sede';

    try {

        const response = await apiClient.post(url, sede);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateSedesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const SedesUpdate = async (id, sede) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/sede/' + id;

    try {

        const response = await apiClient.put(url, sede);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateSedesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const SedesDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/sede/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateSedesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    SedesGetAll,
    SedesGetById,
    SedesCreate,
    SedesUpdate,
    SedesDelete
};

import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const MODELOS_TTL_MS = 10 * 60 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateModelosDependencies = () => {
    invalidateByPrefix('modelos:');
    invalidateByPrefix('vehiculos:');
};

const ModelosGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/modelo';

    try {

        return await getFromCache(
            'modelos:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: MODELOS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const ModelosGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/modelo/' + id;

    try {

        return await getFromCache(
            'modelos:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: MODELOS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const ModelosCreate = async (modelo) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/modelo';

    try {

        const response = await apiClient.post(url, modelo);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateModelosDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const ModelosUpdate = async (id, modelo) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/modelo/' + id;

    try {

        const response = await apiClient.put(url, modelo);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateModelosDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const ModelosDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/modelo/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateModelosDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    ModelosGetAll,
    ModelosGetById,
    ModelosCreate,
    ModelosUpdate,
    ModelosDelete
};

import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const MARCAS_TTL_MS = 10 * 60 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateMarcasDependencies = () => {
    invalidateByPrefix('marcas:');
    invalidateByPrefix('modelos:');
    invalidateByPrefix('vehiculos:');
};

const MarcasGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/marca';

    try {

        return await getFromCache(
            'marcas:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: MARCAS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const MarcasGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/marca/' + id;

    try {

        return await getFromCache(
            'marcas:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: MARCAS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const MarcasCreate = async (marca) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/marca';

    try {

        const response = await apiClient.post(url, marca);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateMarcasDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const MarcasUpdate = async (id, marca) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/marca/' + id;

    try {

        const response = await apiClient.put(url, marca);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateMarcasDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const MarcasDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/marca/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateMarcasDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    MarcasGetAll,
    MarcasGetById,
    MarcasCreate,
    MarcasUpdate,
    MarcasDelete
};

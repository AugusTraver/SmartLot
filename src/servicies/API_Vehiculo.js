import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const VEHICULOS_TTL_MS = 60 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateVehiculosDependencies = () => {
    invalidateByPrefix('vehiculos:');
    invalidateByPrefix('reservas:');
};

const VehiculosGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/vehiculo';

    try {

        return await getFromCache(
            'vehiculos:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: VEHICULOS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const VehiculosGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/vehiculo/' + id;

    try {

        return await getFromCache(
            'vehiculos:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: VEHICULOS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const VehiculosCreate = async (vehiculo) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/vehiculo';

    try {

        const response = await apiClient.post(url, vehiculo);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateVehiculosDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const VehiculosUpdate = async (id, vehiculo) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/vehiculo/' + id;

    try {

        const response = await apiClient.put(url, vehiculo);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateVehiculosDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const VehiculosDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/vehiculo/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateVehiculosDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    VehiculosGetAll,
    VehiculosGetById,
    VehiculosCreate,
    VehiculosUpdate,
    VehiculosDelete
};

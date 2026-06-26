import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const ROLES_TTL_MS = 10 * 60 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateRolesDependencies = () => {
    invalidateByPrefix('roles:');
    invalidateByPrefix('usuarios:');
};

const RolesGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/rol';

    try {

        return await getFromCache(
            'roles:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: ROLES_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const RolesGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/rol/' + id;

    try {

        return await getFromCache(
            'roles:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: ROLES_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const RolesCreate = async (rol) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/rol';

    try {

        const response = await apiClient.post(url, rol);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateRolesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const RolesUpdate = async (id, rol) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/rol/' + id;

    try {

        const response = await apiClient.put(url, rol);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateRolesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const RolesDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/rol/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateRolesDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    RolesGetAll,
    RolesGetById,
    RolesCreate,
    RolesUpdate,
    RolesDelete
};

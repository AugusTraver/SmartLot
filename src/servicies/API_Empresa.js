import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const EMPRESAS_TTL_MS = 10 * 60 * 1000;

const logApiError = (error) => {
    if (import.meta.env.DEV) {
        console.log(error);
    }
};

const invalidateEmpresasDependencies = () => {
    invalidateByPrefix('empresas:');
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('sedes:');
    invalidateByPrefix('garages:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
};

const EmpresasGetAll = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/empresa';

    try {

        return await getFromCache(
            'empresas:all',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: EMPRESAS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const EmpresasGetById = async (id, { force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/empresa/' + id;

    try {

        return await getFromCache(
            'empresas:id:' + id,
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: EMPRESAS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};

const EmpresasGetAuditoria = async ({ force = false } = {}) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/empresa/auditoria';

    try {

        return await getFromCache(
            'empresas:auditoria',
            async () => {
                const response = await apiClient.get(url);

                returnObject.respuesta = true;
                returnObject.datos = response.data;

                return returnObject;
            },
            { ttlMs: EMPRESAS_TTL_MS, force }
        );

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const EmpresasCreate = async (empresa) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/empresa';

    try {

        const response = await apiClient.post(url, empresa);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateEmpresasDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const EmpresasUpdate = async (id, empresa) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/empresa/' + id;

    try {

        const response = await apiClient.put(url, empresa);

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        invalidateEmpresasDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



const EmpresasDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/empresa/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;
        invalidateEmpresasDependencies();

        return returnObject;

    } catch (error) {

        logApiError(error);
        return returnObject;
    }
};



export {
    EmpresasGetAll,
    EmpresasGetById,
    EmpresasGetAuditoria,
    EmpresasCreate,
    EmpresasUpdate,
    EmpresasDelete
};

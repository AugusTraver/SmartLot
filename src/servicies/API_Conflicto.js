import apiClient from './apiClient';
import { getFromCache, invalidateByPrefix } from '../cache/cacheStore';

const CONFLICTOS_TTL_MS = 30 * 1000;

const crearRespuesta = (datosIniciales = null) => ({ respuesta: false, datos: datosIniciales });

const logApiError = (error) => {
  if (import.meta.env.DEV) {
    console.log(error);
  }
};

const invalidateConflictosDependencies = () => {
  invalidateByPrefix('conflictos:');
  invalidateByPrefix('reservas:');
  invalidateByPrefix('garages:');
  invalidateByPrefix('garages:ocupacion-');
  invalidateByPrefix('reservas:disponibilidad:');
};

const getConflictScopeKey = ({ superAdmin = false, idEmpresa, idSede, idUsuario, scopeKey } = {}) => {
  if (scopeKey) return scopeKey;
  if (superAdmin) return 'superadmin';
  if (idSede) return 'sede:' + idSede;
  if (idEmpresa) return 'empresa:' + idEmpresa;
  if (idUsuario) return 'usuario:' + idUsuario;
  return 'tenant:unknown';
};

const ConflictosGetAll = async ({ superAdmin = false, force = false, idEmpresa, idSede, idUsuario, scopeKey } = {}) => {
  const returnObject = crearRespuesta([]);
  const tenantKey = getConflictScopeKey({ superAdmin, idEmpresa, idSede, idUsuario, scopeKey });

  try {
    return await getFromCache(
      'conflictos:all:' + superAdmin + ':' + tenantKey,
      async () => {
        const response = await apiClient.get('/api/conflicto', {
          params: { superAdmin },
        });

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        return returnObject;
      },
      { ttlMs: CONFLICTOS_TTL_MS, force }
    );
  } catch (error) {
    logApiError(error);
  }

  return returnObject;
};

const ConflictosGetPapelera = async ({ superAdmin = false, force = false, idEmpresa, idSede, idUsuario, scopeKey } = {}) => {
  const returnObject = crearRespuesta([]);
  const tenantKey = getConflictScopeKey({ superAdmin, idEmpresa, idSede, idUsuario, scopeKey });

  try {
    return await getFromCache(
      'conflictos:papelera:' + superAdmin + ':' + tenantKey,
      async () => {
        const response = await apiClient.get('/api/conflicto/papelera', {
          params: { superAdmin },
        });

        returnObject.respuesta = true;
        returnObject.datos = response.data;
        return returnObject;
      },
      { ttlMs: CONFLICTOS_TTL_MS, force }
    );
  } catch (error) {
    logApiError(error);
  }

  return returnObject;
};

const ConflictosCreate = async (conflicto) => {
  const returnObject = crearRespuesta(null);

  try {
    const response = await apiClient.post('/api/conflicto', conflicto);
    returnObject.respuesta = true;
    returnObject.datos = response.data;
    invalidateConflictosDependencies();
  } catch (error) {
    logApiError(error);
    returnObject.datos = error.response?.data || { message: error.message };
  }

  return returnObject;
};

const ConflictosUpdate = async (id, conflicto) => {
  const returnObject = crearRespuesta(null);

  try {
    const response = await apiClient.put(`/api/conflicto/${id}`, conflicto);
    returnObject.respuesta = true;
    returnObject.datos = response.data;
    invalidateConflictosDependencies();
  } catch (error) {
    logApiError(error);
    returnObject.datos = error.response?.data || { message: error.message };
  }

  return returnObject;
};

const ConflictosDelete = async (id) => {
  const returnObject = { respuesta: false };

  try {
    await apiClient.delete(`/api/conflicto/${id}`);
    returnObject.respuesta = true;
    invalidateConflictosDependencies();
  } catch (error) {
    logApiError(error);
  }

  return returnObject;
};

const ConflictosRestore = async (id) => {
  const returnObject = crearRespuesta(null);

  try {
    const response = await apiClient.patch(`/api/conflicto/${id}/restaurar`);
    returnObject.respuesta = true;
    returnObject.datos = response.data;
    invalidateConflictosDependencies();
  } catch (error) {
    logApiError(error);
    returnObject.datos = error.response?.data || { message: error.message };
  }

  return returnObject;
};

export {
  ConflictosGetAll,
  ConflictosGetPapelera,
  ConflictosCreate,
  ConflictosUpdate,
  ConflictosDelete,
  ConflictosRestore,
};

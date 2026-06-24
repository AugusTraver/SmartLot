import apiClient from './apiClient';

const crearRespuesta = (datosIniciales = null) => ({ respuesta: false, datos: datosIniciales });

const ConflictosGetAll = async ({ superAdmin = false } = {}) => {
  const returnObject = crearRespuesta([]);

  try {
    const response = await apiClient.get('/api/conflicto', {
      params: { superAdmin },
    });
    returnObject.respuesta = true;
    returnObject.datos = response.data;
  } catch (error) {
    console.log(error);
  }

  return returnObject;
};

const ConflictosGetPapelera = async ({ superAdmin = false } = {}) => {
  const returnObject = crearRespuesta([]);

  try {
    const response = await apiClient.get('/api/conflicto/papelera', {
      params: { superAdmin },
    });
    returnObject.respuesta = true;
    returnObject.datos = response.data;
  } catch (error) {
    console.log(error);
  }

  return returnObject;
};

const ConflictosCreate = async (conflicto) => {
  const returnObject = crearRespuesta(null);

  try {
    const response = await apiClient.post('/api/conflicto', conflicto);
    returnObject.respuesta = true;
    returnObject.datos = response.data;
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    returnObject.datos = error.response?.data || { message: error.message };
  }

  return returnObject;
};

const ConflictosDelete = async (id) => {
  const returnObject = { respuesta: false };

  try {
    await apiClient.delete(`/api/conflicto/${id}`);
    returnObject.respuesta = true;
  } catch (error) {
    console.log(error);
  }

  return returnObject;
};

const ConflictosRestore = async (id) => {
  const returnObject = crearRespuesta(null);

  try {
    const response = await apiClient.patch(`/api/conflicto/${id}/restaurar`);
    returnObject.respuesta = true;
    returnObject.datos = response.data;
  } catch (error) {
    console.log(error);
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

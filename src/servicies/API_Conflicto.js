import apiClient from './apiClient';

const crearRespuesta = (datosIniciales = null) => ({ respuesta: false, datos: datosIniciales });

const ConflictosGetAll = async () => {
  const returnObject = crearRespuesta([]);

  try {
    const response = await apiClient.get('/api/conflicto');
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

export {
  ConflictosGetAll,
  ConflictosCreate,
  ConflictosUpdate,
  ConflictosDelete,
};

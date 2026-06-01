import apiClient from './apiClient';




const VehiculosGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/vehiculo';

    try {

        const response = await apiClient.get(url);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const VehiculosGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/vehiculo/' + id;

    try {

        const response = await apiClient.get(url);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
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

        return returnObject;

    } catch (error) {

        console.log(error);
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

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const VehiculosDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/vehiculo/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;

        return returnObject;

    } catch (error) {

        console.log(error);
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
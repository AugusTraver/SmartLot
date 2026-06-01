import apiClient from './apiClient';




const RolesGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/rol';

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



const RolesGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/rol/' + id;

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



const RolesCreate = async (rol) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/rol';

    try {

        const response = await apiClient.post(url, rol);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
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

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const RolesDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/rol/' + id;

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
    RolesGetAll,
    RolesGetById,
    RolesCreate,
    RolesUpdate,
    RolesDelete
};
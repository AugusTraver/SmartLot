import apiClient from './apiClient';




const ModelosGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/modelo';

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



const ModelosGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/modelo/' + id;

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



const ModelosCreate = async (modelo) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/modelo';

    try {

        const response = await apiClient.post(url, modelo);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
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

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const ModelosDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/modelo/' + id;

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
    ModelosGetAll,
    ModelosGetById,
    ModelosCreate,
    ModelosUpdate,
    ModelosDelete
};
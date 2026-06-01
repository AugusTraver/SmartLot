import apiClient from './apiClient';




const SedesGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/sede';

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



const SedesGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/sede/' + id;

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



const SedesCreate = async (sede) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/sede';

    try {

        const response = await apiClient.post(url, sede);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const SedesUpdate = async (id, sede) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/sede/' + id;

    try {

        const response = await apiClient.put(url, sede);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const SedesDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/sede/' + id;

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
    SedesGetAll,
    SedesGetById,
    SedesCreate,
    SedesUpdate,
    SedesDelete
};
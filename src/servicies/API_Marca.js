import apiClient from './apiClient';




const MarcasGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/marca';

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



const MarcasGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/marca/' + id;

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



const MarcasCreate = async (marca) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/marca';

    try {

        const response = await apiClient.post(url, marca);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const MarcasUpdate = async (id, marca) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/marca/' + id;

    try {

        const response = await apiClient.put(url, marca);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const MarcasDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/marca/' + id;

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
    MarcasGetAll,
    MarcasGetById,
    MarcasCreate,
    MarcasUpdate,
    MarcasDelete
};
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const ModelosGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/modelo';

    try {

        const response = await axios.get(url);

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

    let url = apiUrl + '/api/modelo/' + id;

    try {

        const response = await axios.get(url);

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

    let url = apiUrl + '/api/modelo';

    try {

        const response = await axios.post(url, modelo);

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

    let url = apiUrl + '/api/modelo/' + id;

    try {

        const response = await axios.put(url, modelo);

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

    let url = apiUrl + '/api/modelo/' + id;

    try {

        await axios.delete(url);

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
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const SedesGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/sede';

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



const SedesGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/sede/' + id;

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



const SedesCreate = async (sede) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/sede';

    try {

        const response = await axios.post(url, sede);

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

    let url = apiUrl + '/api/sede/' + id;

    try {

        const response = await axios.put(url, sede);

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

    let url = apiUrl + '/api/sede/' + id;

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
    SedesGetAll,
    SedesGetById,
    SedesCreate,
    SedesUpdate,
    SedesDelete
};
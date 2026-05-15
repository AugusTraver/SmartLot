import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const MarcasGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/marca';

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



const MarcasGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/marca/' + id;

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



const MarcasCreate = async (marca) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/marca';

    try {

        const response = await axios.post(url, marca);

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

    let url = apiUrl + '/api/marca/' + id;

    try {

        const response = await axios.put(url, marca);

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

    let url = apiUrl + '/api/marca/' + id;

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
    MarcasGetAll,
    MarcasGetById,
    MarcasCreate,
    MarcasUpdate,
    MarcasDelete
};
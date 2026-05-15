import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const RolesGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/rol';

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



const RolesGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/rol/' + id;

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



const RolesCreate = async (rol) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/rol';

    try {

        const response = await axios.post(url, rol);

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

    let url = apiUrl + '/api/rol/' + id;

    try {

        const response = await axios.put(url, rol);

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

    let url = apiUrl + '/api/rol/' + id;

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
    RolesGetAll,
    RolesGetById,
    RolesCreate,
    RolesUpdate,
    RolesDelete
};
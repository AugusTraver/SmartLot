import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const VehiculosGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/vehiculo';

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



const VehiculosGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/vehiculo/' + id;

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



const VehiculosCreate = async (vehiculo) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/vehiculo';

    try {

        const response = await axios.post(url, vehiculo);

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

    let url = apiUrl + '/api/vehiculo/' + id;

    try {

        const response = await axios.put(url, vehiculo);

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

    let url = apiUrl + '/api/vehiculo/' + id;

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
    VehiculosGetAll,
    VehiculosGetById,
    VehiculosCreate,
    VehiculosUpdate,
    VehiculosDelete
};
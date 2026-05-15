import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const ReservasGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/reserva';

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



const ReservasGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/reserva/' + id;

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



const ReservasCreate = async (reserva) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/reserva';

    try {

        const response = await axios.post(url, reserva);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const ReservasUpdate = async (id, reserva) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/reserva/' + id;

    try {

        const response = await axios.put(url, reserva);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const ReservasDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = apiUrl + '/api/reserva/' + id;

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
    ReservasGetAll,
    ReservasGetById,
    ReservasCreate,
    ReservasUpdate,
    ReservasDelete
};
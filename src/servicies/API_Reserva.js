import apiClient from './apiClient';




const ReservasGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/reserva';

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



const ReservasGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/reserva/' + id;

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



const ReservasCreate = async (reserva) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/reserva';

    try {

        const response = await apiClient.post(url, reserva);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        returnObject.datos = error.response?.data || { message: error.message };
        return returnObject;
    }
};



const ReservasUpdate = async (id, reserva) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/reserva/' + id;

    try {

        const response = await apiClient.put(url, reserva);

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

    let url = '/api/reserva/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const ReservasCancel = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/reserva/' + id + '/cancel';

    try {

        await apiClient.post(url);

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
    ReservasDelete,
    ReservasCancel
};

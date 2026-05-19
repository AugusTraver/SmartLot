import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('[API_Garage] Usando URL base:', apiUrl);

const GaragesGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/garage';

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



const GaragesGetOcupacionReserva = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/garage/ocupacion_reserva/' + id;

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



const GaragesGetOcupacionNoReserva = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/garage/ocupacion_no_reserva/' + id;

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



const GaragesGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/garage/' + id;

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



const GaragesCreate = async (garage) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/garage';

    console.group('[API_Garage.GaragesCreate]');
    console.log('🔵 URL:', url);
    console.log('🔵 Payload a enviar:', JSON.stringify(garage, null, 2));
    console.groupEnd();

    try {

        const response = await axios.post(url, garage);

        console.log('[API_Garage.GaragesCreate] ✅ Respuesta exitosa (Status:', response.status, ')');
        console.log('[API_Garage.GaragesCreate] Datos retornados:', response.data);
        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.error('[API_Garage.GaragesCreate] ❌ Error en POST:');
        console.error('  Status:', error.response?.status);
        console.error('  Mensaje del servidor:', error.response?.data);
        console.error('  Error:', error.message);
        
        returnObject.datos = error.response?.data || { message: error.message };
        return returnObject;
    }
};



const GaragesUpdate = async (id, garage) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/garage/' + id;

    try {

        const response = await axios.put(url, garage);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const GaragesDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = apiUrl + '/api/garage/' + id;

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
    GaragesGetAll,
    GaragesGetOcupacionReserva,
    GaragesGetOcupacionNoReserva,
    GaragesGetById,
    GaragesCreate,
    GaragesUpdate,
    GaragesDelete
};
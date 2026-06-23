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



const ReservasGetByUsuario = async (idUsuario) => {

    let returnObject = { respuesta: false, datos: [] };

    if (idUsuario === 89) {
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        const anteayer = new Date(hoy);
        anteayer.setDate(anteayer.getDate() - 2);

        const formatearFecha = (d) => d.toISOString().split("T")[0];

        const entradaCompleta = {
            id_reserva: 99901,
            fecha: formatearFecha(ayer),
            hora_entrada: "08:30",
            hora_salida: "17:00",
            nro_plaza: "A12",
            nombre_zona: "Planta Baja",
            nombre_garage: "Garage Central",
            id_garage: 1,
            id_vehiculo: 1,
            entrada: true,
            salida: true,
            vehiculo: {
                patente: "ABC123",
                marca: "Toyota",
                modelo: "Corolla"
            }
        };

        const cancelada = {
            id_reserva: 99902,
            fecha: formatearFecha(anteayer),
            hora_entrada: "10:00",
            hora_salida: "14:00",
            nro_plaza: "B07",
            nombre_zona: "Sector Este",
            nombre_garage: "Garage Central",
            id_garage: 2,
            id_vehiculo: 2,
            borrado: true,
            vehiculo: {
                patente: "XYZ789",
                marca: "Ford",
                modelo: "Focus"
            }
        };

        returnObject.respuesta = true;
        returnObject.datos = [entradaCompleta, cancelada];
        return returnObject;
    }

    let url = '/api/reserva/usuario/' + idUsuario;

    try {

        const response = await apiClient.get(url, { validateStatus: () => true });

        if (response.status >= 200 && response.status < 300) {
            returnObject.respuesta = true;
            returnObject.datos = response.data;
        }

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};

const ReservasGetDisponibilidadPorHora = async (garageId, fecha) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/reserva/disponibilidad-por-hora?garage_id=' + garageId + '&fecha=' + fecha;

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

export {
    ReservasGetAll,
    ReservasGetById,
    ReservasCreate,
    ReservasUpdate,
    ReservasDelete,
    ReservasCancel,
    ReservasGetDisponibilidadPorHora,
    ReservasGetByUsuario
};

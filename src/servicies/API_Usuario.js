import apiClient from './apiClient';




const UsuariosGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/usuario';

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



const UsuariosGetByGarage = async (idGarage) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/usuario/garage/' + idGarage;

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

const UsuariosGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/usuario/' + id;

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



const UsuariosCreate = async (usuario) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/usuario';

    try {

        const response = await apiClient.post(url, usuario);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        returnObject.datos = error.response?.data || null;
        return returnObject;
    }
};



const UsuariosUpdate = async (id, usuario) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/usuario/' + id;

    try {

        const response = await apiClient.put(url, usuario);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};

const UsuariosPatchEstado = async (id, activo) => {
    let returnObject = { respuesta: false, datos: null };
    let url = '/api/usuario/' + id + '/estado';

    try {
        // Se envía un objeto solo con el campo "activo"
        const response = await apiClient.patch(url, { activo });
        returnObject.respuesta = true;
        returnObject.datos = response.data;
        return returnObject;
    } catch (error) {
        console.log(error);
        return returnObject;
    }
};



const UsuariosDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = '/api/usuario/' + id;

    try {

        await apiClient.delete(url);

        returnObject.respuesta = true;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};

const UsuariosLogin = async (email, contraseña) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/usuario/login';

    try {

        const response = await apiClient.post(url, { email, contraseña });

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};

export {
    UsuariosGetAll,
    UsuariosGetByGarage,
    UsuariosGetById,
    UsuariosCreate,
    UsuariosUpdate,
    UsuariosDelete,
    UsuariosPatchEstado,
    UsuariosLogin
};

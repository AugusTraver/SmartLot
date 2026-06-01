import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';



const UsuariosGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/usuario';

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



const UsuariosGetByGarage = async (idGarage) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/usuario/garage/' + idGarage;

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

const UsuariosGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/usuario/' + id;

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



const UsuariosCreate = async (usuario) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/usuario';

    try {

        const response = await axios.post(url, usuario);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const UsuariosUpdate = async (id, usuario) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/usuario/' + id;

    try {

        const response = await axios.put(url, usuario);

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
    let url = apiUrl + '/api/usuario/' + id + '/estado';

    try {
        // Se envía un objeto solo con el campo "activo"
        const response = await axios.patch(url, { activo });
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

    let url = apiUrl + '/api/usuario/' + id;

    try {

        await axios.delete(url);

        returnObject.respuesta = true;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};

const UsuariosLogin = async (email, contraseña) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/usuario/login';

    try {

        const response = await axios.post(url, { email, contraseña });

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

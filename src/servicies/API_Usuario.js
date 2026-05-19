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



export {
    UsuariosGetAll,
    UsuariosGetById,
    UsuariosCreate,
    UsuariosUpdate,
    UsuariosDelete
};
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;



const EmpresasGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/empresa';

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



const EmpresasGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = apiUrl + '/api/empresa/' + id;

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



const EmpresasCreate = async (empresa) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/empresa';

    try {

        const response = await axios.post(url, empresa);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const EmpresasUpdate = async (id, empresa) => {

    let returnObject = { respuesta: false, datos: null };

    let url = apiUrl + '/api/empresa/' + id;

    try {

        const response = await axios.put(url, empresa);

        returnObject.respuesta = true;
        returnObject.datos = response.data;

        return returnObject;

    } catch (error) {

        console.log(error);
        return returnObject;
    }
};



const EmpresasDelete = async (id) => {

    let returnObject = { respuesta: false };

    let url = apiUrl + '/api/empresa/' + id;

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
    EmpresasGetAll,
    EmpresasGetById,
    EmpresasCreate,
    EmpresasUpdate,
    EmpresasDelete
};
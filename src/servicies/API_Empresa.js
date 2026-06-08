import apiClient from './apiClient';




const EmpresasGetAll = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/empresa';

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



const EmpresasGetById = async (id) => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/empresa/' + id;

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

const EmpresasGetAuditoria = async () => {

    let returnObject = { respuesta: false, datos: [] };

    let url = '/api/empresa/auditoria';

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



const EmpresasCreate = async (empresa) => {

    let returnObject = { respuesta: false, datos: null };

    let url = '/api/empresa';

    try {

        const response = await apiClient.post(url, empresa);

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

    let url = '/api/empresa/' + id;

    try {

        const response = await apiClient.put(url, empresa);

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

    let url = '/api/empresa/' + id;

    try {

        await apiClient.delete(url);

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
    EmpresasGetAuditoria,
    EmpresasCreate,
    EmpresasUpdate,
    EmpresasDelete
};

import api from '../api';

export const getFctEvaluations = async () => {
    return await api.get('/fct-evaluations');
};

export const createFctEvaluation = async (id, data) => {
    return await api.post(`/fct-evaluations/${id}`, data);
};

export const uploadFctEvaluationFile = async (id, fileObject) => {
    const formData = new FormData();
    formData.append('file', fileObject);

    return await api.post(`/fct-evaluations/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
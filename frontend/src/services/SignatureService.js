import api from '../api';

export const uploadSignatureCompany = async (contractId, base64Image) => {
    return await api.post(`/contracts/${contractId}/upload-signature-company`, {
        signature: base64Image,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const uploadSignatureSchool = async (contractId, base64Image) => {
    return await api.post(`/contracts/${contractId}/upload-signature-school`, {
        signature: base64Image,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const updateSignedContract = async (documentId, formData) => {
    return await api.post(`/documents/${documentId}/signed-contract`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const restartSignedContract = async (documentId) => {
    return await api.post(`/documents/${documentId}/restart`, {}, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
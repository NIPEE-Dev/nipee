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

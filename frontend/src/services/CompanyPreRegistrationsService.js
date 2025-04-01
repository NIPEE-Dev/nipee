import api from '../api';

export const createCompany = async (companyData) => {
    return await api.post('/company-pre-registrations/store/store', companyData);
};

export const approveCompany = async (id) => {
    return await api.post(`/company-pre-registrations/${id}/approve`);
};

export const rejectCompany = async (id, reason) => {
    return await api.post(`/company-pre-registrations/${id}/reject`, {
        rejection_reason: reason, 
    });
};
import api from '../apiex';

export const createCompany = async (companyData) => {
    return await api.post('/company-pre-registrations/store', companyData);
};
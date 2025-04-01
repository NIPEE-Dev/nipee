import { useState } from 'react';
import { approveCompany, rejectCompany } from '../services/CompanyPreRegistrationsService';
import { createCompany } from '../services/CompanyPreRegistrationsServiceEX';

const useCompanyPreRegistrations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCompanyPreRegistration = async (companyData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createCompany(companyData);

      return {
        status: response.status,
        message: response.data.message || 'Registro realizado com sucesso.',
        data: response.data,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.errors
        ? Object.keys(err.response.data.errors)
            .map((field) => {
              const fieldErrors = err.response.data.errors[field];
              return Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors;
            })
            .join(', ')
        : err.response?.data?.message || 'Erro de conexão. Verifique sua internet e tente novamente.';

      setError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const approveCompanyPreRegistration = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await approveCompany(id);

      return {
        status: response.status,
        message: response.data.message || 'Empresa aprovada com sucesso.',
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao aprovar a empresa. Tente novamente mais tarde.';
      setError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const rejectCompanyPreRegistration = async (id, reason) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await rejectCompany(id, reason); 
  
      return {
        status: response.status,
        message: response.data.message || 'Empresa rejeitada com sucesso.',
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao rejeitar a empresa. Tente novamente mais tarde.';
      setError(errorMessage);
  
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };  

  return {
    addCompanyPreRegistration,
    approveCompanyPreRegistration,
    rejectCompanyPreRegistration,
    loading,
    error,
  };
};

export default useCompanyPreRegistrations;

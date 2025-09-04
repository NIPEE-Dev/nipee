import { useState } from 'react';
import { approveStudent, rejectStudent } from '../services/StudentsPreRegistrationsService';
import { createStudent } from '../services/StudentsPreRegistrationsServiceEx';

const useStudentPreRegistrations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addStudentPreRegistration = async (studentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createStudent(studentData);

      return {
        status: response.status,
        message: response.data.message || "Registo realizado com sucesso.",
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.errors
        ? Object.keys(err.response.data.errors)
            .map((field) => {
              const fieldErrors = err.response.data.errors[field];
              return Array.isArray(fieldErrors)
                ? fieldErrors.join(', ')
                : fieldErrors;
            })
            .join(', ')
        : err.response?.data?.message || 'Erro de conexão. Verifique sua internet e tente novamente.';

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

    const approveStudentPreRegistration = async (id) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await approveStudent(id);
  
        return {
          status: response.status,
          message: response.data.message || 'Candidato aprovado com sucesso.',
        };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao aprovar o candidato. Tente novamente mais tarde.';
        setError(errorMessage);
  
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    const rejectStudentPreRegistration = async (id, reason) => {
      setLoading(true);
      setError(null);
    
      try {
        const response = await rejectStudent(id, reason); 
    
        return {
          status: response.status,
          message: response.data.message || 'Candidato rejeitado com sucesso.',
        };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao rejeitar o candidato. Tente novamente mais tarde.';
        setError(errorMessage);
    
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }; 

  return {
    addStudentPreRegistration,
    approveStudentPreRegistration,
    rejectStudentPreRegistration,
    loading,
    error
  };
};

export default useStudentPreRegistrations;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/changePassword';

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const navigate = useNavigate(); 

  const changeUserPassword = async (email, newPassword, newPasswordConfirmation) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const response = await changePassword(email, newPassword, newPasswordConfirmation);
  
      if (response.message) {
        setSuccessMessage(response.message); 
        navigate('/login'); 
      } else {
        throw new Error(response.message || 'Erro ao trocar a senha. Tente novamente mais tarde.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao trocar a senha. Tente novamente mais tarde.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    changeUserPassword,
    loading,
    error,
    successMessage,
  };
};

export default useChangePassword;

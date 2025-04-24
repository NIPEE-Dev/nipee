import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, sendVerificationCode } from '../services/changePassword'

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [codeSent, setCodeSent] = useState(false); 
  
  const navigate = useNavigate(); 

  const sendVerification = async (email) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await sendVerificationCode(email);
      setSuccessMessage(response.message || 'Código enviado com sucesso!');
      setCodeSent(true); 
    } catch (err) {
      setError(err.message || 'Erro ao enviar o código. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (email, code, newPassword, newPasswordConfirmation) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    if (!code || !newPassword || !newPasswordConfirmation) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await changePassword(email, code, newPassword, newPasswordConfirmation); 
      setSuccessMessage(response.message || 'Senha alterada com sucesso!');
      navigate('/login'); 
    } catch (err) {
      setError(err.message || 'Erro ao trocar a senha. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return {
    sendVerification,
    changeUserPassword,
    loading,
    error,
    successMessage,
    codeSent,
  };
};

export default useChangePassword;

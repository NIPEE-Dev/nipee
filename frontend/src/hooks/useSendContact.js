import { useState } from 'react';
import { sendContactEmail } from '../services/contactService';

const useSendContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const sendContact = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await sendContactEmail(formData);

      if (response.success) {
        setSuccessMessage(response.message || 'Mensagem enviada com sucesso!');
        return true;
      } else {
        throw new Error(response.message || 'Erro ao enviar mensagem.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao enviar mensagem.';
      setError(errorMessage);
      return false; 
    } finally {
      setLoading(false);
    }
  };

  return {
    sendContact,
    loading,
    error,
    successMessage,
  };
};

export default useSendContact;

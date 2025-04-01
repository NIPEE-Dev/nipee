import { useState } from 'react';
import { uploadSignatureCompany, uploadSignatureSchool } from '../services/SignatureService';

const useUploadSignature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const uploadSignature = async (contractId, base64Image, type) => { 
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let response;
      if (type === 'empresa') {
        response = await uploadSignatureCompany(contractId, base64Image); 
      } else if (type === 'escola') {
        response = await uploadSignatureSchool(contractId, base64Image);
      } else {
        throw new Error('Tipo de assinatura inválido');
      }

      if (response.data.message) {
        setSuccessMessage(response.data.message);
      } else {
        throw new Error(response.data.error || 'Erro ao enviar a assinatura.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao enviar a assinatura.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadSignature,
    loading,
    error,
    successMessage,
  };
};

export default useUploadSignature;

import { useState } from 'react';
import { 
  uploadSignatureCompany, 
  uploadSignatureSchool, 
  updateSignedContract, 
  restartSignedContract 
} from '../services/SignatureService';

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

      const msg = response.data?.message || 'Assinatura enviada com sucesso!';
      setSuccessMessage(msg);
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao enviar a assinatura.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadSignedFile = async (documentId, fileObject) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', fileObject);
      const response = await updateSignedContract(documentId, formData);

      const msg = response.data?.message || 'Documento assinado enviado com sucesso!';
      setSuccessMessage(msg);
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao enviar o documento.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const restartContract = async (documentId) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await restartSignedContract(documentId);
      
      const msg = response.data?.message || 'Processo reiniciado com sucesso!';
      setSuccessMessage(msg);
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao reiniciar o processo.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadSignature,
    uploadSignedFile,
    restartContract,
    loading,
    error,
    successMessage,
    setError,
    setSuccessMessage
  };
};

export default useUploadSignature;

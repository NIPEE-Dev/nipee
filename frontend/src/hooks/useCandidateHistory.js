import { useState, useCallback } from "react";
import {
  getCandidateHistory as fetchHistoryApi,
  downloadCandidateHistory as downloadHistoryApi
} from "../services/candidatesService";

export const useCandidateHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearMessages = useCallback(() => {
    setErrorMessage("");
  }, []);

  const fetchHistory = useCallback(async (candidateId) => {
    if (!candidateId) return;
    
    setLoading(true);
    clearMessages();
    try {
      const response = await fetchHistoryApi(candidateId);
      console.log('aqui', response);
      
      setHistory(response.data.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao buscar histórico do candidato"
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const downloadHistory = useCallback(async (candidateId, format = 'pdf') => {
    setLoading(true);
    clearMessages();
    try {
      const response = await downloadHistoryApi(candidateId, format);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', `historico_candidato_${candidateId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setErrorMessage("Erro ao gerar arquivo de download");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  return {
    history,
    loading,
    errorMessage,
    fetchHistory,
    downloadHistory,
    clearMessages,
  };
};
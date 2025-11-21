import { useState, useCallback } from 'react';
import { 
    getFctEvaluations, 
    createFctEvaluation, 
    uploadFctEvaluationFile 
} from '../services/FctEvaluationService';

const useFctEvaluation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [evaluations, setEvaluations] = useState([]); 
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchEvaluations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFctEvaluations();
            setEvaluations(response.data.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao buscar avaliações.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const submitEvaluationData = async (id, data) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await createFctEvaluation(id, data);
            setSuccessMessage('Dados da avaliação salvos e documento gerado com sucesso!');
            await fetchEvaluations(); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao salvar dados da avaliação.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const uploadEvaluation = async (id, file) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await uploadFctEvaluationFile(id, file);
            setSuccessMessage('Upload do arquivo realizado com sucesso!')
            await fetchEvaluations();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao enviar o arquivo.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        evaluations,
        fetchEvaluations,
        submitEvaluationData,
        uploadEvaluation,
        loading,
        error,
        successMessage,
    };
};

export default useFctEvaluation;
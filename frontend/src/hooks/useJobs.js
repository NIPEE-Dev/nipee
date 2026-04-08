import { useState, useCallback } from "react";
import { 
  getJobs as fetchJobApi,
  getJobDetail as fetchJobDetailApi, 
  applyToJob as applyToJobApi,
  getJobsHistory as getHistoryApi,
  closeJob as closeJobApi,
  createInvite as createInviteApi,
  createInviteCompatible as createInviteCompatibleApi,
  getJobsInvite as getJobsInviteApi,
  updateJobInterview as updateJobInterviewApi,
  updateJobInterviewEvaluation as updateJobInterviewEvaluationApi,
  updateJobInterviewTesting as updateJobInterviewTestingApi,
  cancelJobInterview as cancelJobInterviewApi,
} from "../services/jobService";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobDetail, setJobDetail] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setJobs([]);
    clearMessages();
    try {
      const response = await fetchJobApi();
      setJobs(response.data.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao buscar vagas"
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const fetchJobDetail = useCallback(async (id) => {
    setLoading(true);
    setJobDetail(null);
    clearMessages();
    try {
      const response = await fetchJobDetailApi(id);
      setJobDetail(response.data.data || null);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao buscar detalhes da vaga"
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const applyForJob = useCallback(async (jobId) => {
    setLoading(true);
    clearMessages();
    try {
      await applyToJobApi(jobId);
      if (jobDetail && jobDetail.id == jobId) {
        setJobDetail(prev => ({
          ...prev,
          already_applied: true
        }));
      }
      setSuccessMessage("Candidatura enviada com sucesso!");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao se candidatar à vaga."
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages, jobDetail]);

  const getHistory = useCallback(async () => {
    setLoading(true);
    setMyApplications([]);
    clearMessages();
    try {
      const response = await getHistoryApi();
      setMyApplications(response.data.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao carregar candidaturas."
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const closeJob = useCallback(async (jobId) => {
    setLoading(true);
    clearMessages();
    try {
      await closeJobApi(jobId, { status: 2 });
      await fetchJobs();

      if (jobDetail?.id === jobId) {
        setJobDetail(prev => ({
          ...prev,
          status: 2
        }));
      }

      setSuccessMessage("Vaga encerrada com sucesso!");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Erro ao encerrar vaga.");
    } finally {
      setLoading(false);
    }
  }, [clearMessages, jobDetail, fetchJobs]);

  const createInvite = useCallback(async (jobId, inviteData) => {
    setLoading(true);
    clearMessages();
    try {
      const response = await createInviteApi(jobId, inviteData);
      setSuccessMessage("Convite para entrevista enviado com sucesso!");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao enviar convite para entrevista."
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const createInviteCompatible = useCallback(async (jobId, inviteData) => {
    setLoading(true);
    clearMessages();
    try {
      const response = await createInviteCompatibleApi(jobId, inviteData);
      setSuccessMessage("Convite para entrevista enviado com sucesso!");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao enviar convite para entrevista."
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const getJobsInvite = useCallback(async () => {
      setLoading(true);
      setMyInvites([]);
      clearMessages();
      try {
        const response = await getJobsInviteApi();
        setMyInvites(response.data || []); 
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao carregar convites."
        );
      } finally {
        setLoading(false);
      }
  }, [clearMessages]);

    const updateJobInterview = useCallback(async (jobInterviewId, data) => {
      setLoading(true);
      clearMessages();
      try {
        const response = await updateJobInterviewApi(jobInterviewId, data);
        setSuccessMessage("Status do convite atualizado com sucesso!");
        return response;
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao atualizar status do convite."
        );
        throw err;
      } finally {
        setLoading(false);
      }
    }, [clearMessages]);

     const updateJobInterviewEvaluation = useCallback(async (jobId, candidateId, data) => {
      setLoading(true);
      clearMessages();
      try {
        const response = await updateJobInterviewEvaluationApi(jobId, candidateId, data);
        setSuccessMessage("Avaliação da entrevista atualizada com sucesso!");
        return response;
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao atualizar avaliação da entrevista."
        );
        throw err;
      } finally {
        setLoading(false);
      }
    }, [clearMessages]);

    const updateJobInterviewTesting = useCallback(async (jobId, candidateId, data) => {
      setLoading(true);
      clearMessages();
      try {
        const response = await updateJobInterviewTestingApi(jobId, candidateId, data);
        setSuccessMessage("Avaliação do teste atualizada com sucesso!");
        return response;
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao atualizar avaliação do teste."
        );
        throw err;
      } finally {
        setLoading(false);
      }
    }, [clearMessages]);

    const cancelJobInterview = useCallback(async (jobId, candidateId) => {
      setLoading(true);
      clearMessages();
      try {
        const response = await cancelJobInterviewApi(jobId, candidateId);
        setSuccessMessage("Entrevista cancelada com sucesso!");
        return response;
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao cancelar entrevista."
        );
        throw err;
      } finally {
        setLoading(false);
      }
    }, [clearMessages]);

  return {
    jobs,
    jobDetail,
    myApplications,
    myInvites,
    loading,
    errorMessage,
    successMessage,
    fetchJobs,
    fetchJobDetail,
    applyForJob,
    getHistory,
    closeJob,
    createInvite,
    createInviteCompatible,
    getJobsInvite,
    updateJobInterview,
    updateJobInterviewEvaluation,
    updateJobInterviewTesting,
    clearMessages,
    cancelJobInterview,
  };
};

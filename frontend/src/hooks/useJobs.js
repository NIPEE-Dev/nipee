import { useState, useCallback } from "react";
import { 
  getJobs as fetchJobApi,
  getJobDetail as fetchJobDetailApi, 
  applyToJob as applyToJobApi,
  getJobsHistory as getHistoryApi,
  closeJob as closeJobApi,
  createInvite as createInviteApi 
} from "../services/jobService";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobDetail, setJobDetail] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
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

  return {
    jobs,
    jobDetail,
    myApplications,
    loading,
    errorMessage,
    successMessage,
    fetchJobs,
    fetchJobDetail,
    applyForJob,
    getHistory,
    closeJob,
    createInvite,
    clearMessages,
  };
};

import { useState, useCallback, useEffect } from "react";
import {
  getShools as fetchSchoolsApi,
  getJobs as fetchJobsApi,
} from "../services/public";

export const usePublic = () => {
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
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
      const response = await fetchJobsApi();
      setJobs(response.data.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao buscar vagas"
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

    const fetchSchools = useCallback(async () => {
      setLoading(true);
      setSchools([]);
      clearMessages();
      try {
        const response = await fetchSchoolsApi();
        setSchools(response.data.data || []);
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao buscar escolas"
        );
      } finally {
        setLoading(false);
      }
    }, [clearMessages]);

  return {
    schools,
    jobs,
    loading,
    errorMessage,
    successMessage,
    clearMessages,
    fetchSchools,
    fetchJobs,
  };
};

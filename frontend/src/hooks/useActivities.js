import { useState, useCallback, useEffect } from "react";
import {
  getActivities as fetchActivitiesApi,
  createActivity as createActivityApi,
  updateActivity as updateActivityApi,
  deleteActivity as deleteActivityApi,
  updateActivityStatus as updateActivityStatusApi,
} from "../services/activitiesService";

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [workedHours, setWorkedHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeContract, setActiveContract] = useState(true);

  const clearMessages = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const fetchActivities = useCallback(async (params) => {
    setLoading(true);
    clearMessages();
    try {
      const response = await fetchActivitiesApi(params);
      if (response.data.activeContract === false) {
        setActiveContract(false);
        setActivities([]);
        setTotalHours(0);
        setWorkedHours(0);
      } else {
        setActiveContract(true);
        setActivities(response.data.activities || []);
        setTotalHours(response.data.totalHours || 0);
        setWorkedHours(response.data.workedHours || 0);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao buscar atividades"
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const createNewActivity = useCallback(
    async (payload) => {
      setLoading(true);
      clearMessages();
      try {
        await createActivityApi(payload);
        setSuccessMessage("Atividade criada com sucesso!");
        await fetchActivities();
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao criar atividade"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages, fetchActivities]
  );

  const updateActivity = useCallback(
    async (id, payload) => {
      setLoading(true);
      clearMessages();
      try {
        await updateActivityApi(id, payload);
        setSuccessMessage("Atividade atualizada com sucesso!");
        await fetchActivities();
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao atualizar atividade"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages, fetchActivities]
  );

  const deleteActivity = useCallback(
    async (id) => {
      setLoading(true);
      clearMessages();
      try {
        await deleteActivityApi(id);
        setSuccessMessage("Atividade excluída com sucesso!");
        await fetchActivities();
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao excluir atividade"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages, fetchActivities]
  );

  const updateActivityStatus = useCallback(
    async (id, payload) => {
      setLoading(true);
      clearMessages();
      try {
        await updateActivityStatusApi(id, payload);
        setSuccessMessage("Status da atividade atualizado com sucesso!");
        await fetchActivities();
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Erro ao atualizar status da atividade"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages, fetchActivities]
  );

  return {
    activities,
    activeContract,
    loading,
    totalHours,
    workedHours,
    errorMessage,
    successMessage,
    fetchActivities,
    createNewActivity,
    updateActivity,
    deleteActivity,
    updateActivityStatus,
    clearMessages,
  };
};

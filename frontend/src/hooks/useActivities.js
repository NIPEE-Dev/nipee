import { useState, useCallback, useEffect } from "react";
import {
  getActivities as fetchActivitiesApi,
  createActivity as createActivityApi,
  updateActivity as updateActivityApi,
  deleteActivity as deleteActivityApi,
} from "../services/activitiesService";

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [workedHours, setWorkedHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    clearMessages();
    try {
      const response = await fetchActivitiesApi();
      setActivities(response.data.activities || []);
      setTotalHours(response.data.totalHours || 0);
      setWorkedHours(response.data.workedHours || 0);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Erro ao buscar atividades");
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const createNewActivity = useCallback(async (payload) => {
    setLoading(true);
    clearMessages();
    try {
      await createActivityApi(payload);
      setSuccessMessage("Atividade criada com sucesso!");
      await fetchActivities();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Erro ao criar atividade");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearMessages, fetchActivities]);

  const updateActivity = useCallback(async (id, payload) => {
    setLoading(true);
    clearMessages();
    try {
      await updateActivityApi(id, payload);
      setSuccessMessage("Atividade atualizada com sucesso!");
      await fetchActivities();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Erro ao atualizar atividade");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearMessages, fetchActivities]);

  const deleteActivity = useCallback(async (id) => {
    setLoading(true);
    clearMessages();
    try {
      await deleteActivityApi(id);
      setSuccessMessage("Atividade excluída com sucesso!");
      await fetchActivities();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Erro ao excluir atividade");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearMessages, fetchActivities]);

  return {
    activities,
    loading,
    totalHours,
    workedHours,
    errorMessage,
    successMessage,
    fetchActivities,
    createNewActivity,
    updateActivity,
    deleteActivity,
    clearMessages,
  };
};
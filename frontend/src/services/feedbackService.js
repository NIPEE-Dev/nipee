import api from "../api";

export const getFeedbacks = async () => {
  return await api.get("/candidates/feedback");
};

export const createFeedback = async (candidateId, payload) => {
  return await api.post(`/candidates/${candidateId}/feedback`, payload);
};

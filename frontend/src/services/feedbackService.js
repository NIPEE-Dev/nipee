import api from "../api";

export const getFeedbacks = async () => {
  return await api.get("/candidates/feedback");
};

export const createFeedback = async (candidateId, payload) => {
  return await api.post(`/candidates/${candidateId}/feedback`, payload);
};
export const updateFeedback = async (candidateId, feedbackId, payload) => {
  return await api.put(
    `/candidates/${candidateId}/feedback/${feedbackId}`,
    payload,
  );
};

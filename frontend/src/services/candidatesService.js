import api from '../api';

export const getCandidateHistory = async (candidateId) => {
  return await api.get(`/candidates/${candidateId}/history`);
};

export const downloadCandidateHistory = async (candidateId, format) => {
  return await api.get(`/candidates/${candidateId}/history/download`, {
    params: { format },
    responseType: 'blob',
  });
};
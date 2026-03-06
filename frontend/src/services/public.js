import api from '../api';

export const getShools = async (params) => {
  return await api.get('/schools/public', { params });
};

export const getJobs = async (params) => {
  return await api.get('/jobs/public', { params });
};
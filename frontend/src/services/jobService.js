import api from '../api';

export const getJobs = async () => {
  return await api.get('/jobs');
};

export const getJobDetail = async (id) => {
  return await api.get(`/jobs/${id}`);
};

export const applyToJob = async (jobId) => {
  return await api.post(`/jobs/${jobId}/apply`);
};

export const getJobsHistory = async () => {
  return await api.get('/jobs/history');
};
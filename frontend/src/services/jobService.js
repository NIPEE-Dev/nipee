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

export const closeJob = async (jobId, data) => {
  return await api.patch(`/jobs/${jobId}/status`, data);
};

export const createInvite = async (jobId, data) => {
  return await api.post(`/jobs/${jobId}/invite/interview`, data);
};

export const createInviteCompatible = async (jobId, data) => {
  return await api.post(`/jobs/${jobId}/invite`, data);
};

export const getJobsInvite = async () => {
  return await api.get('/jobs/invites/interview');
};

export const updateJobInterview = async (jobInterviewId, data) => {
  return await api.put(`/jobs/invites/interview/${jobInterviewId}`, data);
};

export const updateJobInterviewEvaluation = async (jobId, candidateId, data) => {
  return await api.put(`/jobs/${jobId}/invite/interview/${candidateId}/evaluation`, data);
};

export const updateJobInterviewTesting = async (jobId, candidateId, data) => {
  return await api.put(`/jobs/${jobId}/invite/interview/${candidateId}/testing`, data);
};
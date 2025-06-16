import api from '../api';

export const getActivities = async () => {
  return await api.get('/activities');
};

export const createActivity = async (payload) => {
  return await api.post('/activities', payload);
};

export const updateActivity = async (id, payload) => {
  return await api.put(`/activities/${id}`, payload);
};

export const deleteActivity = async (id) => {
  return await api.delete(`/activities/${id}`);
};
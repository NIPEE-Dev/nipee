import api from '../api';

export const sendContactEmail = async (formData) => {
  try {
    const response = await api.post('/send-email-contact', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao enviar o e-mail.');
  }
};

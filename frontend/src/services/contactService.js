import api from '../apiex';

export const sendContactEmail = async (formData) => {
  try {
    const response = await api.post('/enviar-contato', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao enviar o e-mail.');
  }
};

import api from '../apiex';

export const changePassword = async (email, newPassword, newPasswordConfirmation) => {
  try {
    const response = await api.post('/change-password', {
      email,
      password: newPassword, 
      password_confirmation: newPasswordConfirmation, 
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao trocar a senha.');
  }
};

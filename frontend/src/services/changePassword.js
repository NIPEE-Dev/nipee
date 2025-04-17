import api from '../apiex';

export const changePassword = async (email, code, newPassword, newPasswordConfirmation) => {
  try {
    const response = await api.post('/change-password', {
      email,
      code, 
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao trocar a senha.');
  }
};

export const sendVerificationCode = async (email) => {
  try {
    const response = await api.post('/send-verification-code', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao enviar o código de verificação.');
  }
};
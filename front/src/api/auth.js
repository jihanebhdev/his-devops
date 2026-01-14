import apiClient from './axios';
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    });
    return response.data;
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', {
      email
    });
    return response.data;
  },
  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

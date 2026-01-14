import apiClient from './axios';
export const statsService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/stats/dashboard');
    return response.data;
  },
  getPatientStats: async () => {
    const response = await apiClient.get('/stats/patients');
    return response.data;
  },
  getAppointmentStats: async () => {
    const response = await apiClient.get('/stats/rendezvous');
    return response.data;
  },
  getFinancialStats: async () => {
    const response = await apiClient.get('/stats/facturation');
    return response.data;
  },
  getOccupationStats: async () => {
    const response = await apiClient.get('/stats/occupation');
    return response.data;
  }
};

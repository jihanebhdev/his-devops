import apiClient from './axios';
export const constantesService = {
  getAll: async () => {
    const response = await apiClient.get('/constantes');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/constantes/${id}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/constantes/patient/${patientId}`);
    return response.data;
  },
  create: async (constantesData) => {
    const response = await apiClient.post('/constantes', constantesData);
    return response.data;
  }
};

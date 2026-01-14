import apiClient from './axios';
export const facturesService = {
  getAll: async () => {
    const response = await apiClient.get('/factures');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/factures/${id}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/factures/patient/${patientId}`);
    return response.data;
  },
  getMyFactures: async () => {
    const response = await apiClient.get('/factures/mes-factures');
    return response.data;
  },
  create: async (factureData) => {
    const response = await apiClient.post('/factures', factureData);
    return response.data;
  },
  update: async (id, factureData) => {
    const response = await apiClient.put(`/factures/${id}`, factureData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/factures/${id}`);
    return response.data;
  }
};

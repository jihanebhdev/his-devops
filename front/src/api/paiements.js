import apiClient from './axios';
export const paiementsService = {
  getAll: async () => {
    const response = await apiClient.get('/paiements');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/paiements/${id}`);
    return response.data;
  },
  getByFacture: async (factureId) => {
    const response = await apiClient.get(`/paiements/facture/${factureId}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/paiements/patient/${patientId}`);
    return response.data;
  },
  getMyPaiements: async () => {
    const response = await apiClient.get('/paiements/mes-paiements');
    return response.data;
  },
  create: async (paiementData) => {
    const response = await apiClient.post('/paiements', paiementData);
    return response.data;
  },
  update: async (id, paiementData) => {
    const response = await apiClient.put(`/paiements/${id}`, paiementData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/paiements/${id}`);
    return response.data;
  }
};

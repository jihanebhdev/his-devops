import apiClient from './axios';
export const assurancesService = {
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/assurances/patient/${patientId}`);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/assurances');
    return response.data;
  },
  create: async (assuranceData) => {
    const response = await apiClient.post('/assurances', null, {
      params: {
        patientId: assuranceData.patientId,
        nomAssurance: assuranceData.nomAssurance,
        numeroContrat: assuranceData.numeroContrat,
        tauxCouverture: assuranceData.tauxCouverture
      }
    });
    return response.data;
  },
  update: async (id, assuranceData) => {
    const response = await apiClient.put(`/assurances/${id}`, assuranceData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/assurances/${id}`);
    return response.data;
  }
};

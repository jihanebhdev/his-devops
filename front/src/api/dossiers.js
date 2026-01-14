import apiClient from './axios';
export const dossiersService = {
  getById: async (id) => {
    const response = await apiClient.get(`/dossiers/${id}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/dossiers/patient/${patientId}`);
    return response.data;
  },
  create: async (dossierData) => {
    const response = await apiClient.post('/dossiers', dossierData);
    return response.data;
  },
  update: async (id, dossierData) => {
    const response = await apiClient.put(`/dossiers/${id}`, dossierData);
    return response.data;
  }
};

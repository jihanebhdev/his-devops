import apiClient from './axios';
export const consultationsService = {
  getAll: async () => {
    const response = await apiClient.get('/consultations');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/consultations/${id}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/consultations/patient/${patientId}`);
    return response.data;
  },
  getByMedecin: async (medecinId) => {
    const response = await apiClient.get(`/consultations/medecin/${medecinId}`);
    return response.data;
  },
  getMyConsultations: async () => {
    const response = await apiClient.get('/consultations/mes-consultations');
    return response.data;
  },
  create: async (consultationData) => {
    const response = await apiClient.post('/consultations', consultationData);
    return response.data;
  },
  update: async (id, consultationData) => {
    const response = await apiClient.put(`/consultations/${id}`, consultationData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/consultations/${id}`);
    return response.data;
  }
};

import apiClient from './axios';
export const hospitalisationsService = {
  getAll: async () => {
    const response = await apiClient.get('/hospitalisations');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/hospitalisations/${id}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/hospitalisations/patient/${patientId}`);
    return response.data;
  },
  getEnCours: async () => {
    const response = await apiClient.get('/hospitalisations/en-cours');
    return response.data;
  },
  create: async (hospitalisationData) => {
    const response = await apiClient.post('/hospitalisations', hospitalisationData);
    return response.data;
  },
  enregistrerSortie: async (id, notesSortie) => {
    const response = await apiClient.patch(`/hospitalisations/${id}/sortie?notesSortie=${encodeURIComponent(notesSortie)}`);
    return response.data;
  }
};

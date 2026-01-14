import apiClient from './axios';
export const patientsService = {
  getAll: async () => {
    const response = await apiClient.get('/patients');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },
  search: async (query) => {
    const response = await apiClient.get(`/patients/recherche?q=${query}`);
    return response.data;
  },
  create: async (patientData) => {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  },
  update: async (id, patientData) => {
    const response = await apiClient.put(`/patients/${id}`, patientData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  },
  getMyProfile: async () => {
    const response = await apiClient.get('/patients/mon-profil');
    return response.data;
  },
  updateMyProfile: async (profileData) => {
    const response = await apiClient.put('/patients/mon-profil', profileData);
    return response.data;
  }
};

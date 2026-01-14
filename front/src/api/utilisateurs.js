import apiClient from './axios';
export const utilisateursService = {
  getAll: async () => {
    const response = await apiClient.get('/utilisateurs');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/utilisateurs/${id}`);
    return response.data;
  },
  create: async (userData) => {
    const response = await apiClient.post('/utilisateurs', userData);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await apiClient.put(`/utilisateurs/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/utilisateurs/${id}`);
    return response.data;
  },
  getMyProfile: async () => {
    const response = await apiClient.get('/utilisateurs/mon-profil');
    return response.data;
  },
  updateMyProfile: async (profileData) => {
    const response = await apiClient.put('/utilisateurs/mon-profil', profileData);
    return response.data;
  },
  getAllDoctors: async () => {
    const response = await apiClient.get('/utilisateurs/medecins');
    return response.data;
  },
  getAllNurses: async () => {
    const response = await apiClient.get('/utilisateurs/infirmiers');
    return response.data;
  }
};

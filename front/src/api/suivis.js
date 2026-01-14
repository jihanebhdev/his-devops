import apiClient from './axios';
export const suivisService = {
  getById: async (id) => {
    const response = await apiClient.get(`/suivis/${id}`);
    return response.data;
  },
  getByHospitalisation: async (hospitalisationId) => {
    const response = await apiClient.get(`/suivis/hospitalisation/${hospitalisationId}`);
    return response.data;
  },
  create: async (suiviData) => {
    const response = await apiClient.post('/suivis', suiviData);
    return response.data;
  }
};

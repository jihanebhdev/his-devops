import apiClient from './axios';
export const litsService = {
  getAll: async () => {
    const response = await apiClient.get('/lits');
    return response.data;
  },
  getDisponibles: async (service = null) => {
    const url = service 
      ? `/lits/disponibles?service=${service}`
      : '/lits/disponibles';
    const response = await apiClient.get(url);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/lits/${id}`);
    return response.data;
  },
  create: async (litData) => {
    const response = await apiClient.post('/lits', null, {
      params: litData
    });
    return response.data;
  },
  update: async (id, litData) => {
    const response = await apiClient.put(`/lits/${id}`, null, {
      params: litData
    });
    return response.data;
  }
};

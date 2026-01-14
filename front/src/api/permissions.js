import apiClient from './axios';
export const permissionsService = {
  getAll: async () => {
    const response = await apiClient.get('/permissions');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/permissions/${id}`);
    return response.data;
  },
  create: async (permissionData) => {
    const { nom, description } = permissionData;
    const params = new URLSearchParams();
    if (nom) {
      params.append('nom', nom);
    }
    params.append('description', description || '');
    const response = await apiClient.post('/permissions', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  update: async (id, permissionData) => {
    const { nom, description } = permissionData;
    const params = new URLSearchParams();
    if (nom) {
      params.append('nom', nom);
    }
    params.append('description', description || '');
    const response = await apiClient.put(`/permissions/${id}`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/permissions/${id}`);
    return response.data;
  }
};

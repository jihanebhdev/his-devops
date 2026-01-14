import apiClient from './axios';
export const rolesService = {
  getAll: async () => {
    const response = await apiClient.get('/roles');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },
  create: async (roleData) => {
    const { nom, description, permissionIds } = roleData;
    const params = new URLSearchParams();
    if (nom) {
      params.append('nom', nom);
    }
    params.append('description', description || '');
    if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
      permissionIds.forEach((permId) => {
        params.append('permissionIds', permId.toString());
      });
    }
    console.log('Création avec form-urlencoded:', params.toString());
    console.log('PermissionIds à envoyer:', permissionIds);
    const response = await apiClient.post('/roles', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  update: async (id, roleData) => {
    const { nom, description, permissionIds } = roleData;
    const params = new URLSearchParams();
    if (nom) {
      params.append('nom', nom);
    }
    params.append('description', description || '');
    if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
      permissionIds.forEach((permId) => {
        params.append('permissionIds', permId.toString());
      });
    }
    console.log('Envoi avec form-urlencoded:', params.toString());
    console.log('PermissionIds à envoyer:', permissionIds);
    console.log('Nombre de permissionIds:', permissionIds?.length || 0);
    const response = await apiClient.put(`/roles/${id}`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  }
};

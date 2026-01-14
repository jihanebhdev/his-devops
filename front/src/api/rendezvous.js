import apiClient from './axios';
export const rendezvousService = {
  getAll: async () => {
    const response = await apiClient.get('/rendezvous');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/rendezvous/${id}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/rendezvous/patient/${patientId}`);
    return response.data;
  },
  getByMedecin: async (medecinId) => {
    const response = await apiClient.get(`/rendezvous/medecin/${medecinId}`);
    return response.data;
  },
  getMyAppointments: async () => {
    const response = await apiClient.get('/rendezvous/mes-rendezvous');
    return response.data;
  },
  create: async (rendezvousData) => {
    const response = await apiClient.post('/rendezvous', rendezvousData);
    return response.data;
  },
  update: async (id, rendezvousData) => {
    const response = await apiClient.put(`/rendezvous/${id}`, rendezvousData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/rendezvous/${id}`);
    return response.data;
  },
  changeStatus: async (id, statut) => {
    const response = await apiClient.patch(`/rendezvous/${id}/statut?statut=${statut}`);
    return response.data;
  }
};

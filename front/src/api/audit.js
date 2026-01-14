import apiClient from './axios';
export const auditService = {
  getAll: async (page = 0, size = 20) => {
    const response = await apiClient.get(`/audit/logs?page=${page}&size=${size}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/audit/logs/${id}`);
    return response.data;
  },
  getByUser: async (utilisateurId) => {
    const response = await apiClient.get(`/audit/utilisateur/${utilisateurId}`);
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/audit/patient/${patientId}`);
    return response.data;
  },
  getByEntity: async (entityType, entityId) => {
    const response = await apiClient.get(`/audit/entity/${entityType}/${entityId}`);
    return response.data;
  },
  getByAction: async (action) => {
    const response = await apiClient.get(`/audit/action/${action}`);
    return response.data;
  },
  getByDateRange: async (startDate, endDate, page = 0, size = 20) => {
    const response = await apiClient.get(
      `/audit/date-range?start=${startDate}&end=${endDate}&page=${page}&size=${size}`
    );
    return response.data;
  }
};

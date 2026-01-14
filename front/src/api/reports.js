import apiClient from './axios';
export const reportsService = {
  getPatientSummary: async (patientId) => {
    const response = await apiClient.get(`/reports/patient/${patientId}/summary`);
    return response.data;
  },
  exportPatientSummary: async (patientId) => {
    const response = await apiClient.get(`/reports/patient/${patientId}/summary/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

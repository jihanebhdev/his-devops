import apiClient from './axios';
export const documentsService = {
  getAll: async () => {
    const response = await apiClient.get('/documents');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  },
  download: async (id) => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },
  getByPatient: async (patientId) => {
    const response = await apiClient.get(`/documents/patient/${patientId}`);
    return response.data;
  },
  getByPatientAndCategory: async (patientId, categorie) => {
    const response = await apiClient.get(`/documents/patient/${patientId}/categorie/${categorie}`);
    return response.data;
  },
  upload: async (file, documentData) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('request', JSON.stringify(documentData));
    const response = await apiClient.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  }
};

import apiClient from './axios';
export const notificationsService = {
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  getUnread: async () => {
    const response = await apiClient.get('/notifications/unread');
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },
  create: async (notificationData) => {
    const response = await apiClient.post('/notifications', notificationData);
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
  deleteRead: async () => {
    const response = await apiClient.delete('/notifications/read');
    return response.data;
  }
};

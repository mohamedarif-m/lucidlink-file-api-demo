import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const fileAPI = {
  // Get all files
  getFiles: async () => {
    const response = await apiClient.get('/api/files');
    return response.data;
  },

  // Upload a file
  uploadFile: async (fileData) => {
    const response = await apiClient.post('/api/files/upload', fileData);
    return response.data;
  },

  // Get file by ID
  getFileById: async (id) => {
    const response = await apiClient.get(`/api/files/${id}`);
    return response.data;
  },

  // Delete file
  deleteFile: async (id) => {
    const response = await apiClient.delete(`/api/files/${id}`);
    return response.data;
  },

  // Get storage statistics
  getStorageStats: async () => {
    const response = await apiClient.get('/api/files/stats/storage');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;

// Made with Bob

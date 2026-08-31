import api from './api';

export const getComplaints = (params) => api.get('/complaints', { params });
export const getMyComplaints = () => api.get('/complaints/mine');
export const getComplaint = (id) => api.get(`/complaints/${id}`);
export const createComplaint = (payload) => api.post('/complaints', payload);
export const upvoteComplaint = (id) => api.patch(`/complaints/${id}/upvote`);
export const updateStatus = (id, payload) => api.patch(`/complaints/${id}/status`, payload);
export const submitFeedback = (id, payload) => api.patch(`/complaints/${id}/feedback`, payload);
export const checkDuplicates = (category, area) => api.get('/complaints', { params: { category, area, status: 'Pending,In Progress' } });

export const exportComplaintsUrl = (params) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const qs = new URLSearchParams(params).toString();
  return `${API_URL}/complaints/export${qs ? `?${qs}` : ''}`;
};

import api from './api';

export const signup = (payload) => api.post('/auth/signup', payload);
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('portal_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('portal_token');
    if (!token) { setLoading(false); return; }
    authService.getMe()
      .then((res) => { setUser(res.data.data); localStorage.setItem('portal_user', JSON.stringify(res.data.data)); })
      .catch(() => { localStorage.removeItem('portal_token'); localStorage.removeItem('portal_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const data = res.data.data;
    localStorage.setItem('portal_token', data.token);
    localStorage.setItem('portal_user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const signup = useCallback(async (payload) => {
    const res = await authService.signup(payload);
    const data = res.data.data;
    localStorage.setItem('portal_token', data.token);
    localStorage.setItem('portal_user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

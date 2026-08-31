import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/Loading';

const ProtectedRoute = ({ roles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size={32} /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'officer' ? '/officer/dashboard' : '/dashboard'} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

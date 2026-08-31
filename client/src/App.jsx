import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

import CitizenDashboard from './pages/CitizenDashboard';
import ReportComplaint from './pages/ReportComplaint';
import MyComplaints from './pages/MyComplaints';
import BrowseComplaints from './pages/BrowseComplaints';
import ComplaintDetail from './pages/ComplaintDetail';

import OfficerDashboard from './pages/OfficerDashboard';
import OfficerComplaintReview from './pages/OfficerComplaintReview';

import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />

        <Route path="/complaints" element={<BrowseComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />

        <Route element={<ProtectedRoute roles={['citizen']} />}>
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/complaints/new" element={<ReportComplaint />} />
          <Route path="/complaints/mine" element={<MyComplaints />} />
        </Route>

        <Route element={<ProtectedRoute roles={['officer']} />}>
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/complaints/:id" element={<OfficerComplaintReview />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

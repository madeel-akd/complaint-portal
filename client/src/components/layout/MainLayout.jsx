import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;

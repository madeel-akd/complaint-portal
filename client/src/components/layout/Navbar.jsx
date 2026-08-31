import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import appConfig from '../../config/appConfig';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isAuthenticated
    ? user.role === 'officer'
      ? [{ to: '/officer/dashboard', label: 'Officer Dashboard' }, { to: '/complaints', label: 'Public Feed' }]
      : [{ to: '/dashboard', label: 'Dashboard' }, { to: '/complaints', label: 'Browse' }, { to: '/complaints/mine', label: 'My Complaints' }]
    : [{ to: '/complaints', label: 'Browse Complaints' }];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
          <img 
            src="/assets/icon-badge-green.png" 
            alt="Citizen Complaint Portal" 
            className="h-9 w-9 rounded-xl object-contain shadow-sm" 
          />
          <span className="text-gray-900 dark:text-white font-bold">{appConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600">{l.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary-600">Login</Link>
              <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1.5">{l.label}</Link>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block text-sm font-medium py-1.5 text-red-500">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1.5">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1.5 text-primary-600">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

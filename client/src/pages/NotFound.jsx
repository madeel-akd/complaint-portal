import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-7xl font-bold text-primary-600">404</h1>
    <h2 className="text-xl font-semibold mt-4">Page not found</h2>
    <p className="text-gray-500 mt-2 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="mt-6"><Button><Home size={16} /> Back Home</Button></Link>
  </div>
);

export default NotFound;

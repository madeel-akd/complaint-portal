import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div className={`flex items-center justify-center py-10 ${className}`}>
    <Loader2 size={size} className="animate-spin text-primary-600" />
  </div>
);

export const Skeleton = ({ className = '' }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`} />;

import React from 'react';

const colorMap = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Road: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
  Garbage: 'bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400',
  Water: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
  Electricity: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Other: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
};

const Badge = ({ value, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'} ${className}`}>
    {value}
  </span>
);

export default Badge;

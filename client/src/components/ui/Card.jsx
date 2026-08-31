import React from 'react';

const Card = ({ children, className = '', title, action }) => (
  <div className={`card p-5 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

export default Card;

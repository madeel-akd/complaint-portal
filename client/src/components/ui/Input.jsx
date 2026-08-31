import React from 'react';

const Input = React.forwardRef(({ label, error, required, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>}
    <input ref={ref} className={`input-base ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));

export default Input;

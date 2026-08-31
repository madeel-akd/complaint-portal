import React from 'react';

const Select = ({ label, error, required, options = [], placeholder = 'Select...', className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>}
    <select className={`input-base ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props}>
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>)}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default Select;

import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-4">
    <div className="h-14 w-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <Icon size={26} className="text-gray-400" />
    </div>
    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    {message && <p className="text-sm text-gray-500 mt-1 max-w-xs">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;

'use client';

import type { Toast as ToastType } from '@/context/ToastContext';

const Toast = ({ type, message }: ToastType) => {
  const bg = {
    success: 'bg-green-500',
    error: 'bg-gray-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`text-white px-4 py-2 rounded shadow ${bg}`}>
      {message}
    </div>
  );
};

export default Toast;

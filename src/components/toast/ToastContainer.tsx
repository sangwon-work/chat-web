'use client';

import { useToastContext } from '@/context/ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts } = useToastContext();

  return (
    <div className="fixed bottom-[5rem] left-1/2 transform -translate-x-1/2 z-50 space-y-2 flex flex-col items-center">
      {toasts.map((toast, idx) => (
        <Toast key={idx} {...toast} />
      ))}
    </div>
  );
}

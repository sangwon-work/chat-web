'use client';

import { useToastContext } from '@/context/ToastContext';
import { setToastContext } from '@/lib/toast';

export default function ClientContextBinder() {
  const ctx = useToastContext();
  setToastContext(ctx);
  return null;
}

import { useToastContext } from '@/context/ToastContext';

let toastCtx: ReturnType<typeof useToastContext> | null = null;

export const setToastContext = (ctx: ReturnType<typeof useToastContext>) => {
  toastCtx = ctx;
};

export const toast = {
  success: (msg: string) => toastCtx?.addToast({ type: 'success', message: msg }),
  error: (msg: string) => toastCtx?.addToast({ type: 'error', message: msg }),
  info: (msg: string) => toastCtx?.addToast({ type: 'info', message: msg }),
};

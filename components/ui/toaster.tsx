'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const pushToast = React.useCallback((message: string, tone: ToastTone = 'info') => {
    const nextToast = { id: Date.now(), message, tone };
    setToasts((current) => [...current, nextToast]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== nextToast.id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-3 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto rounded-full border px-4 py-2 text-sm font-medium shadow-soft backdrop-blur',
              toast.tone === 'success' && 'border-rescue/30 bg-rescue/15 text-rescue',
              toast.tone === 'error' && 'border-crisis/30 bg-crisis/15 text-crisis',
              'border-white/10 bg-slate-900/80 text-slate-100',
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

'use client';

import { ToastProvider } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

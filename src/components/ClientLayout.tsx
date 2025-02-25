'use client';

import { useEnv } from '@/hooks/useEnv';
import { RouteMiddleware } from '@/middleware/router';
import Loading from '@/components/loading';
import MusicPlayer from '@/components/MusicPlayer';
import React, { useEffect } from 'react';
import { AudioProvider } from '@/components/AudioProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isDevelopment } = useEnv();
  const debugScreens = isDevelopment ? 'debug-screens' : '';
  const pathname = usePathname();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MusicPlayer />
      <AudioProvider>
        <RouteMiddleware>
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        </RouteMiddleware>
      </AudioProvider>
    </ThemeProvider>
  );
} 
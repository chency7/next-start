import './global.css';
import { Metadata } from 'next';
import { useEnv } from '@/hooks/useEnv';
import { RouteMiddleware } from '@/middleware/router';
import Loading from '@/components/loading';
import MusicPlayer from '@/components/MusicPlayer';
import React from 'react';
import { AudioProvider } from '@/components/AudioProvider';
import { inter, pacifico, lxgwWenKai, calSans } from '@/utils/fonts';

export const metadata: Metadata = {
  title: {
    default: 'Chency.me',
    template: '%s | chency.me',
  },
  description: 'Software engineer and web developer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    shortcut: '/favicon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isDevelopment } = useEnv();
  const debugScreens = isDevelopment ? 'debug-screens' : '';

  return (
    <html
      lang="zh"
      className={[lxgwWenKai.variable, pacifico.variable, inter.variable, calSans.variable].join(
        ' '
      )}
    >
      <head>
        {/* 分析工具停用 */}
        {/* <Analytics /> */}
      </head>
      <body className={`bg-black ${debugScreens}`}>
        <MusicPlayer />
        {/* 暂时隐藏关于按钮 */}
        <AudioProvider>
          <RouteMiddleware>
            <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
          </RouteMiddleware>
        </AudioProvider>
      </body>
    </html>
  );
}

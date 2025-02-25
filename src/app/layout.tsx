import './global.css';
import { Metadata } from 'next';
import { inter, pacifico, lxgwWenKai, calSans } from '@/utils/fonts';
import ClientLayout from '@/components/ClientLayout';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh"
      className={[lxgwWenKai.variable, pacifico.variable, calSans.variable].join(' ')}
      suppressHydrationWarning
    >
      <body className="bg-black">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

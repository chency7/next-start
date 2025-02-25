import { Inter, Pacifico } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'block',
  weight: ['400'],
  fallback: ['system-ui', 'sans-serif'],
});

export const pacifico = Pacifico({
  weight: ['400'],
  subsets: ['latin'],
  display: 'block',
  variable: '--font-Pacifico',
  fallback: ['cursive', 'system-ui'],
});

export const lxgwWenKai = localFont({
  src: [
    {
      path: '../../public/fonts/LXGWWenKai-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-wenkai',
  display: 'block',
  fallback: ['system-ui', 'Microsoft YaHei', 'sans-serif'],
});

export const calSans = localFont({
  src: [
    {
      path: '../../public/fonts/CalSans-SemiBold.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-calsans',
  display: 'block',
  fallback: ['system-ui', 'sans-serif'],
});

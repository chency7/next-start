'use client';

import Loading from '../components/loading';
import { useFontLoading } from '@/hooks/useFontLoading';

export function RouteMiddleware({ children }: { children: React.ReactNode }) {
  const loading = useFontLoading();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div>{children}</div>
    </>
  );
}

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@assessment/ui/lib/utils';

export function NavigationProgress(): React.ReactElement | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevUrl = useRef(pathname + searchParams.toString());

  const start = useCallback(() => {
    setProgress(0);
    setVisible(true);
    let current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      current += (90 - current) * 0.1;
      setProgress(current);
      if (current >= 89) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 100);
  }, []);

  const finish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);
  }, []);

  useEffect(() => {
    const currentUrl = pathname + searchParams.toString();
    if (currentUrl !== prevUrl.current) {
      finish();
      prevUrl.current = currentUrl;
    }
  }, [pathname, searchParams, finish]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || anchor.target === '_blank') return;
      const currentUrl = pathname + searchParams.toString();
      if (href !== pathname && href !== currentUrl) {
        start();
      }
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, searchParams, start]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5">
      <div
        className={cn(
          'h-full bg-gradient-to-r from-primary to-teal-400 transition-all duration-200 ease-out',
          progress >= 100 && 'opacity-0'
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// app/TokenSync.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function TokenSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const at = getCookie('accesstoken');
    if (at) {
      // 1) localStorage 갱신
      localStorage.setItem('accesstoken', at);

      // 2) 동기화 쿠키 즉시 제거(만료)
      document.cookie = 'accesstoken=; Max-Age=0; path=/';
    }
  }, [pathname, searchParams]);

  return null;
}

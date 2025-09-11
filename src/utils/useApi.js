// hooks/useApi.js
'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useApi = () => {
  const router = useRouter();

  const request = useCallback(async (url, options = {}, authRequire = true) => {
    try {
      const res = await fetch( `${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}${url}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
          ...(authRequire ? { Authorization: `Bearer ${Cookies.get('jwt_token')}` } : {}),
          ...(options.headers || {})
        },
          body: options.body ? JSON.stringify(options.body) : undefined,
        
      });

   if (res.status === 401 && authRequire) {
        Cookies.remove('jwt_token');
        router.push("/session-expired");
        clearToken()
      }

      if (!res.ok) {
        const err = await res.json();
        return { error: err.message || 'Something went wrong' };
      }
      console.log("api response", res);
      const data = await res.json();
      return { response: res , data };

      } catch (err) {
        console.log("api error", err);
      return { error: 'Network error' };
    }
  }, [router]);

  return { request };
};

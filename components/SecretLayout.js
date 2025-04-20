// components/SecretLayout.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession } from '@/lib/authHelpers';

export default function SecretLayout({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUserSession();
      if (!user) {
        router.push('/login');
      } else {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (checkingAuth) {
    return <div className="p-6">Checking authentication...</div>;
  }

  return <div>{children}</div>;
}

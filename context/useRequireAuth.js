import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './authContext';

export const useRequireAuth = (redirectUrl = '/loginpage') => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  return isAuthenticated;
};

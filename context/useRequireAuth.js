import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './authContext';

export const useRequireAuth = (redirectUrl = '/loginpage') => {
  const { isAuthenticated, isLoading  } = useAuth();
 // console.log('useRequireAuth - isAuthenticated:', isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
    //  console.log('Redirecting to:', redirectUrl);
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  return { isAuthenticated, isLoading  };
};

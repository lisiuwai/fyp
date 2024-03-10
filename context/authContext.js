import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            response.json().then(json => reject({ status: response.status, ...json }));
          }
        })
        .then(data => {
          console.log(data);
          if (data.token && data.email) { 
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            localStorage.setItem('userEmail', data.email);
            resolve(data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const checkAuthStatus = useCallback(async () => {
      setIsLoading(true);
    const token = localStorage.getItem('token');
    //console.log('Token from local storage:', token);
    if (token) {
      try {
        const response = await fetch('/api/user/token', {
          method: 'POST',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
          }),
        });
        const data = await response.json();
        setIsAuthenticated(data.isValid); 
        
      } catch (error) {
        console.error('Error validating token:', error);
      }
      setIsLoading(false);
     // console.log('Token is valid, setting isAuthenticated to true');
    }else{
      setIsLoading(false);
      console.log('No token found, setting isAuthenticated to false');
    }
  }, []);
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    router.push('/loginpage');
  }, [router]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isLoading, login, logout, checkAuthStatus,userEmail, setUserEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

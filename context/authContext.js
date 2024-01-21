import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = (userid, password) => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid, password }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();

          } else {
            response.json().then(json => reject({ status: response.status, ...json }));
          }
        })
        .then(data => {
          setIsAuthenticated(true);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    router.push('/loginpage');
  }, [router]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

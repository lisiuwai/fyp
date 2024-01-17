import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);


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
              
              setIsAuthenticated(true);
              resolve(response.json()); 
            } else {
              response.json().then(json => reject(json));
            }
          })
          .catch(error => {
            reject(error);
          });
        });
      };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect ,useContext} from 'react';


import API from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (token, userObj) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    // optional: verify token or refresh on mount
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
    return useContext(AuthContext);
  };
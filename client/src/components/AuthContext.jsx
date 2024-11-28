import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogIn, setIsLogIn] = useState(localStorage.getItem('token'));

  const logIn = (token) => {
    localStorage.setItem('token', token);
    setIsLogIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setIsLogIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLogIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

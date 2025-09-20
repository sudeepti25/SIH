import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'patient', 'doctor', 'pharmacy', 'admin'
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const login = (userData, type, tokens = {}) => {
    setUser(userData);
    setUserType(type);
    
    // Handle JWT tokens
    if (tokens.accessToken) {
      setAuthToken(tokens.accessToken);
      localStorage.setItem('authToken', tokens.accessToken);
    }
    
    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setAuthToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  const updateTokens = (newAuthToken, newRefreshToken = null) => {
    setAuthToken(newAuthToken);
    localStorage.setItem('authToken', newAuthToken);
    
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  };

  // Load saved user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const savedAuthToken = localStorage.getItem('authToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
    
    if (savedAuthToken) {
      setAuthToken(savedAuthToken);
    }
    
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
  }, []);

  const value = {
    user,
    userType,
    authToken,
    refreshToken,
    login,
    logout,
    updateTokens,
    isLoggedIn: !!user,
    isAuthenticated: !!authToken,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

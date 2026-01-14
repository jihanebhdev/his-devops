import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../api/auth';
import { ROLE_ROUTES } from '../config/api';
const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      if (response.success && response.data) {
        const { token: newToken, username: userUsername, roles } = response.data;
        const userData = {
          username: userUsername,
          roles: roles
        };
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, error: 'Erreur de connexion' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };
  const hasAnyRole = (roles) => {
    return user?.roles?.some(role => roles.includes(role)) || false;
  };
  const getRoleRoute = () => {
    if (!user?.roles || user.roles.length === 0) return '/login';
    const firstRole = user.roles[0];
    return ROLE_ROUTES[firstRole] || '/login';
  };
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    getRoleRoute,
    isAuthenticated: !!token
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

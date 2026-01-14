import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_ROUTES } from '../config/api';
import { CircularProgress, Box } from '@mui/material';
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (isAuthenticated && user?.roles && user.roles.length > 0) {
    const firstRole = user.roles[0];
    const route = ROLE_ROUTES[firstRole] || '/';
    return <Navigate to={route} replace />;
  }
  return children;
};
export default PublicRoute;

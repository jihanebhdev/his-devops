import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_ROUTES } from '../config/api';
import { CircularProgress, Box } from '@mui/material';
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!user || !user.roles || user.roles.length === 0) {
    return <Navigate to="/login" replace />;
  }
  const firstRole = user.roles[0];
  const route = ROLE_ROUTES[firstRole] || '/login';
  return <Navigate to={route} replace />;
};
export default HomeRedirect;

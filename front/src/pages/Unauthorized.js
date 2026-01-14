import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Lock as LockIcon, Home as HomeIcon } from '@mui/icons-material';
const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Card sx={{ width: '100%', textAlign: 'center', p: 4 }}>
          <CardContent>
            <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Accès non autorisé
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </Typography>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
export default Unauthorized;

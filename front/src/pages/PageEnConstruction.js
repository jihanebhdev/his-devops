import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';
const PageEnConstruction = ({ titre = 'Page en construction' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
        <CardContent>
          <ConstructionIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {titre}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Cette page est en cours de développement et sera bientôt disponible.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
export default PageEnConstruction;

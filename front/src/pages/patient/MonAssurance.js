import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Shield as ShieldIcon } from '@mui/icons-material';
import { patientsService } from '../../api/patients';
import { assurancesService } from '../../api/assurances';
const MonAssurance = () => {
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile);
  const patientId = profile?.data?.id;
  const { data, isLoading } = useQuery(
    ['assurances', patientId],
    () => assurancesService.getByPatient(patientId),
    { enabled: !!patientId }
  );
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const assurances = data?.data || [];
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mon assurance
      </Typography>
      {assurances.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ShieldIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Aucune assurance enregistrée
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {assurances.map((assurance) => (
            <Grid item xs={12} md={6} key={assurance.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <ShieldIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {assurance.nomAssurance}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Numéro de contrat: {assurance.numeroContrat}
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Taux de couverture
                      </Typography>
                      <Typography variant="h5" color="primary.main">
                        {assurance.tauxCouverture}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default MonAssurance;

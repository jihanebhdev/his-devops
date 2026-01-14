import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import { patientsService } from '../../api/patients';
import { dossiersService } from '../../api/dossiers';
const MonDossierMedical = () => {
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile);
  const patientId = profile?.data?.id;
  const { data, isLoading } = useQuery(
    ['dossier', patientId],
    () => dossiersService.getByPatient(patientId),
    { enabled: !!patientId }
  );
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const dossier = data?.data;
  if (!dossier) {
    return (
      <Box>
        <Typography variant="h6" color="textSecondary">
          Aucun dossier médical disponible
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mon dossier médical
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {dossier.groupeSanguin && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Groupe sanguin
                </Typography>
                <Typography variant="body1">{dossier.groupeSanguin}</Typography>
              </Grid>
            )}
            {dossier.rhesus && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Rhésus
                </Typography>
                <Typography variant="body1">{dossier.rhesus}</Typography>
              </Grid>
            )}
            {dossier.historiqueMedical && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Historique médical
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {dossier.historiqueMedical}
                  </Typography>
                </Grid>
              </>
            )}
            {dossier.notesCliniques && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Notes cliniques
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {dossier.notesCliniques}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
export default MonDossierMedical;

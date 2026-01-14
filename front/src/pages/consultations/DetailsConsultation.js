import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { consultationsService } from '../../api/consultations';
const DetailsConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(['consultation', id], () => consultationsService.getById(id));
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const consultation = data?.data;
  if (!consultation) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Consultation non trouvée
        </Typography>
      </Box>
    );
  }
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/consultations')}>
          Retour
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Détails de la consultation
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Informations générales
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Patient
                  </Typography>
                  <Typography variant="body1">
                    {consultation.patient?.prenom} {consultation.patient?.nom}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Médecin
                  </Typography>
                  <Typography variant="body1">
                    {consultation.medecin?.prenom} {consultation.medecin?.nom}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date et heure
                  </Typography>
                  <Typography variant="body1">{formaterDate(consultation.dateHeure)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Type
                  </Typography>
                  <Chip
                    label={consultation.typeConsultation || 'Générale'}
                    color="primary"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Motif
                  </Typography>
                  <Typography variant="body1">{consultation.motif}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Examen clinique
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {consultation.examenClinique || 'Aucun examen clinique enregistré'}
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Diagnostic
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {consultation.diagnostic || 'Aucun diagnostic enregistré'}
              </Typography>
              {consultation.prescription && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                    Prescription
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {consultation.prescription}
                  </Typography>
                </>
              )}
              {consultation.recommandations && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                    Recommandations
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {consultation.recommandations}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DetailsConsultation;

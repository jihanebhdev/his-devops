import React from 'react';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalHospital as HospitalIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { consultationsService } from '../../api/consultations';
import { hospitalisationsService } from '../../api/hospitalisations';
import CarteStatistique from '../../components/shared/CarteStatistique';
import { calculateTrendData } from '../../utils/dataTransformers';
const DashboardMedecin = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { data: consultations, isLoading: consultationsLoading } = useQuery(
    'consultationsMedecin',
    () => consultationsService.getByMedecin(1).catch(() => ({ data: [] }))
  );
  const { data: hospitalisations, isLoading: hospitalisationsLoading } = useQuery(
    'hospitalisationsEnCours',
    hospitalisationsService.getEnCours
  );
  if (consultationsLoading || hospitalisationsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const consultationsAujourdhui = consultations?.data?.filter((consultation) => {
    const dateConsultation = new Date(consultation.dateHeure);
    return dateConsultation.toDateString() === new Date().toDateString();
  }) || [];
  const nombreConsultations = consultations?.data?.length || 0;
  const nombreHospitalisations = hospitalisations?.data?.length || 0;
  const nombrePatientsUniques = new Set(consultations?.data?.map((c) => c.patientId)).size || 0;
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tableau de bord - Médecin
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Consultations aujourd'hui"
            valeur={consultationsAujourdhui.length}
            icone={<MedicalIcon />}
            couleur="primary"
            variation="+15%"
            tendance={calculateTrendData(consultations?.data || [], 'dateHeure')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Hospitalisations en cours"
            valeur={nombreHospitalisations}
            icone={<HospitalIcon />}
            couleur="error"
            variation="En cours"
            tendance={calculateTrendData(hospitalisations?.data || [], 'dateAdmission')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Total consultations"
            valeur={nombreConsultations}
            icone={<MedicalIcon />}
            couleur="success"
            variation="+8%"
            tendance={calculateTrendData(consultations?.data || [], 'dateHeure')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Patients ce mois"
            valeur={nombrePatientsUniques}
            icone={<MedicalIcon />}
            couleur="warning"
            variation="Uniques"
            tendance={calculateTrendData(consultations?.data || [], 'dateHeure')}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
              mb: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Consultations d'aujourd'hui
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/consultations/nouvelle')}
                >
                  Nouvelle
                </Button>
              </Box>
              <List>
                {consultationsAujourdhui.length > 0 ? (
                  consultationsAujourdhui.slice(0, 5).map((consultation) => (
                    <ListItem
                      key={consultation.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          {consultation.patient?.prenom?.charAt(0) || 'P'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${consultation.patient?.prenom || ''} ${consultation.patient?.nom || ''}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(consultation.dateHeure).toLocaleTimeString('fr-FR')} -{' '}
                              {consultation.typeConsultation || 'Consultation'}
                            </Typography>
                            {consultation.diagnostic && (
                              <Chip
                                label={consultation.diagnostic}
                                size="small"
                                color="primary"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                    Aucune consultation aujourd'hui
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
          {}
          <Card
            sx={{
              backgroundColor: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Hospitalisations en cours
              </Typography>
              <List>
                {hospitalisations?.data?.length > 0 ? (
                  hospitalisations.data.slice(0, 5).map((hospitalisation) => (
                    <ListItem
                      key={hospitalisation.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'error.main' }}>
                          <HospitalIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${hospitalisation.patient?.prenom || ''} ${hospitalisation.patient?.nom || ''}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Lit: {hospitalisation.lit?.numeroLit || 'N/A'} - {hospitalisation.motifAdmission}
                            </Typography>
                            <Chip
                              label={hospitalisation.statut}
                              size="small"
                              color="error"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/hospitalisations/${hospitalisation.id}`)}
                      >
                        Voir
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                    Aucune hospitalisation en cours
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardMedecin;

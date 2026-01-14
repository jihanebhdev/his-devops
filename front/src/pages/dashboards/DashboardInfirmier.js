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
  LocalHospital as HospitalIcon,
  Favorite as VitalIcon,
  Assignment as SuiviIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { hospitalisationsService } from '../../api/hospitalisations';
import { constantesService } from '../../api/constantes';
import CarteStatistique from '../../components/shared/CarteStatistique';
const DashboardInfirmier = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { data: hospitalisations, isLoading: hospitalisationsLoading } = useQuery(
    'hospitalisationsEnCours',
    hospitalisationsService.getEnCours
  );
  const { data: constantes, isLoading: constantesLoading } = useQuery(
    'constantesRecentes',
    () => constantesService.getByPatient(1).catch(() => ({ data: [] }))
  );
  if (hospitalisationsLoading || constantesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const nombreHospitalisations = hospitalisations?.data?.length || 0;
  const nombreConstantes = constantes?.data?.length || 0;
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tableau de bord - Infirmier
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Hospitalisations en cours"
            valeur={nombreHospitalisations}
            icone={<HospitalIcon />}
            couleur="error"
            variation="En cours"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Constantes enregistrées"
            valeur={nombreConstantes}
            icone={<VitalIcon />}
            couleur="primary"
            variation="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Suivis à faire"
            valeur={nombreHospitalisations}
            icone={<SuiviIcon />}
            couleur="success"
            variation="Aujourd'hui"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Patients à surveiller"
            valeur={nombreHospitalisations}
            icone={<HospitalIcon />}
            couleur="warning"
            variation="En cours"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={6}>
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
                  Hospitalisations en cours
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/hospitalisations')}
                >
                  Voir tout
                </Button>
              </Box>
              <List>
                {hospitalisations?.data?.length > 0 ? (
                  hospitalisations.data.map((hospitalisation) => (
                    <ListItem
                      key={hospitalisation.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'error.main' }}>
                          {hospitalisation.patient?.prenom?.charAt(0) || 'P'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${hospitalisation.patient?.prenom || ''} ${hospitalisation.patient?.nom || ''}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Lit: {hospitalisation.lit?.numeroLit || 'N/A'} - {hospitalisation.motifAdmission}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={hospitalisation.statut}
                                size="small"
                                color="error"
                                sx={{ mr: 0.5 }}
                              />
                              <Chip
                                icon={<VitalIcon />}
                                label="Constantes requises"
                                size="small"
                                color="warning"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/constantes-vitales/nouvelle?patientId=${hospitalisation.patientId}`)}
                        >
                          Constantes
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/hospitalisations/${hospitalisation.id}`)}
                        >
                          Voir
                        </Button>
                      </Box>
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
          {}
          <Card
            sx={{
              backgroundColor: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Actions rapides
              </Typography>
              <Button
                variant="contained"
                fullWidth
                startIcon={<VitalIcon />}
                onClick={() => navigate('/constantes-vitales/nouvelle')}
                sx={{ mb: 1 }}
              >
                Enregistrer constantes
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SuiviIcon />}
                onClick={() => navigate('/suivis/nouveau')}
              >
                Nouveau suivi
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardInfirmier;

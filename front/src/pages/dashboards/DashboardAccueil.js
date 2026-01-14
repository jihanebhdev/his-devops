import React, { useState } from 'react';
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
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Bed as BedIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { rendezvousService } from '../../api/rendezvous';
import { litsService } from '../../api/lits';
import { patientsService } from '../../api/patients';
import CarteStatistique from '../../components/shared/CarteStatistique';
const DashboardAccueil = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [dateSelectionnee] = useState(new Date());
  const { data: rendezvous, isLoading: rendezvousLoading } = useQuery(
    'rendezvousAujourdhui',
    () => rendezvousService.getByMedecin(1).catch(() => ({ data: [] }))
  );
  const { data: litsDisponibles, isLoading: litsLoading } = useQuery(
    'litsDisponibles',
    litsService.getDisponibles
  );
  const { data: patients, isLoading: patientsLoading } = useQuery(
    'patientsRecents',
    patientsService.getAll
  );
  if (rendezvousLoading || litsLoading || patientsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const rendezvousAujourdhui = rendezvous?.data?.filter((rdv) => {
    const dateRdv = new Date(rdv.dateHeure);
    return dateRdv.toDateString() === dateSelectionnee.toDateString();
  }) || [];
  const nombreLitsDisponibles = litsDisponibles?.data?.length || 0;
  const nombrePatients = patients?.data?.length || 0;
  const nouveauxPatients = patients?.data?.slice(0, 5).length || 0;
  const getStatutChip = (statut) => {
    const couleurs = {
      PLANIFIE: 'default',
      CONFIRME: 'success',
      ANNULE: 'error',
      TERMINE: 'info',
      ABSENT: 'warning',
    };
    return couleurs[statut] || 'default';
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tableau de bord - Accueil
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Rendez-vous aujourd'hui"
            valeur={rendezvousAujourdhui.length}
            icone={<CalendarIcon />}
            couleur="primary"
            variation="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Lits disponibles"
            valeur={nombreLitsDisponibles}
            icone={<BedIcon />}
            couleur="success"
            variation="Disponibles"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Total patients"
            valeur={nombrePatients}
            icone={<PersonAddIcon />}
            couleur="warning"
            variation="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Nouveaux patients"
            valeur={nouveauxPatients}
            icone={<PersonAddIcon />}
            couleur="info"
            variation="Ce mois"
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
                  Rendez-vous d'aujourd'hui
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/rendezvous/nouveau')}
                  size="small"
                >
                  Nouveau
                </Button>
              </Box>
              <List>
                {rendezvousAujourdhui.length > 0 ? (
                  rendezvousAujourdhui.slice(0, 6).map((appointment) => (
                    <ListItem
                      key={appointment.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {appointment.patient?.prenom?.charAt(0) || 'P'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${appointment.patient?.prenom || ''} ${appointment.patient?.nom || ''}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(appointment.dateHeure).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              - {appointment.motif}
                            </Typography>
                            <Chip
                              label={appointment.statut}
                              size="small"
                              color={getStatutChip(appointment.statut)}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: isDark ? '#0c1017' : '#ffffff' }}>
                    <Typography variant="body2" color="textSecondary">
                      Aucun rendez-vous aujourd'hui
                    </Typography>
                  </Paper>
                )}
              </List>
            </CardContent>
          </Card>
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
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/patients/nouveau')}
                sx={{ mb: 1 }}
              >
                Nouveau patient
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BedIcon />}
                onClick={() => navigate('/lits')}
              >
                Gérer les lits
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardAccueil;

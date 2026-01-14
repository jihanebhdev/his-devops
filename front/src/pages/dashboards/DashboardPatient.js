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
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  Receipt as ReceiptIcon,
  LocalHospital as HospitalIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { patientsService } from '../../api/patients';
import { rendezvousService } from '../../api/rendezvous';
import { consultationsService } from '../../api/consultations';
import { facturesService } from '../../api/factures';
import { constantesService } from '../../api/constantes';
import CarteStatistique from '../../components/shared/CarteStatistique';
const DashboardPatient = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useQuery('myProfile', patientsService.getMyProfile);
  const { data: appointments, isLoading: appointmentsLoading } = useQuery(
    'myAppointments',
    rendezvousService.getMyAppointments
  );
  const { data: consultations, isLoading: consultationsLoading } = useQuery(
    'myConsultations',
    consultationsService.getMyConsultations
  );
  const { data: bills, isLoading: billsLoading } = useQuery('myBills', () => {
    if (profile?.data?.id) {
      return facturesService.getByPatient(profile.data.id);
    }
    return Promise.resolve({ data: [] });
  });
  const { data: constantes, isLoading: constantesLoading } = useQuery('myConstantes', () => {
    if (profile?.data?.id) {
      return constantesService.getByPatient(profile.data.id);
    }
    return Promise.resolve({ data: [] });
  });
  if (
    profileLoading ||
    appointmentsLoading ||
    consultationsLoading ||
    billsLoading ||
    constantesLoading
  ) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const patientName = profile?.data ? `${profile.data.prenom} ${profile.data.nom}` : 'Patient';
  const prochainsRendezVous = appointments?.data?.filter(
    (apt) => new Date(apt.dateHeure) > new Date()
  ) || [];
  const facturesEnAttente = bills?.data?.filter((bill) => bill.statut !== 'PAYE') || [];
  const donneesConstantes = constantes?.data
    ?.slice(-7)
    .map((constante) => ({
      date: new Date(constante.dateHeure).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      temperature: constante.temperature,
      tension: constante.tensionArterielleSystolique,
    })) || [];
  const chartColors = {
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    text: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    primary: '#1976d2',
    secondary: '#2e7d32',
    error: '#d32f2f',
    warning: '#ed6c02',
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Bienvenue, {patientName}
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Rendez-vous à venir"
            valeur={prochainsRendezVous.length}
            icone={<CalendarIcon />}
            couleur="primary"
            variation="Prochains"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Consultations"
            valeur={consultations?.data?.length || 0}
            icone={<MedicalIcon />}
            couleur="success"
            variation="Total"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Factures"
            valeur={bills?.data?.length || 0}
            icone={<ReceiptIcon />}
            couleur="warning"
            variation={facturesEnAttente.length > 0 ? `${facturesEnAttente.length} en attente` : 'Toutes payées'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Constantes vitales"
            valeur={constantes?.data?.length || 0}
            icone={<MedicalIcon />}
            couleur="info"
            variation="Enregistrées"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {}
        {donneesConstantes.length > 0 && (
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                backgroundColor: isDark ? '#0c1017' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Évolution de mes constantes vitales
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {donneesConstantes.length}
                    </Typography>
                    <Chip
                      icon={<TrendingUpIcon />}
                      label="Stable"
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(46, 125, 50, 0.2)',
                        color: '#4caf50',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      mt: 1,
                    }}
                  >
                    Température et tension pour les 7 derniers jours
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={donneesConstantes}>
                    <defs>
                      <linearGradient id="colorTemperaturePatient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.error} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={chartColors.error} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTensionPatient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis
                      dataKey="date"
                      stroke={chartColors.text}
                      style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke={chartColors.text}
                      style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={chartColors.text}
                      style={{ fontSize: '0.75rem' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0c1017' : '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 8,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: chartColors.text }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stackId="1"
                      stroke={chartColors.error}
                      fill="url(#colorTemperaturePatient)"
                      name="Température (°C)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="tension"
                      stackId="1"
                      stroke={chartColors.primary}
                      fill="url(#colorTensionPatient)"
                      name="Tension (mmHg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
        {}
        <Grid item xs={12} md={donneesConstantes.length > 0 ? 4 : 6}>
          <Card
            sx={{
              background: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              mb: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Mes prochains rendez-vous
                </Typography>
              </Box>
              <List>
                {prochainsRendezVous.length > 0 ? (
                  prochainsRendezVous.slice(0, 3).map((appointment) => (
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
                      <ListItemText
                        primary={new Date(appointment.dateHeure).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
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
                              color={
                                appointment.statut === 'CONFIRME'
                                  ? 'success'
                                  : appointment.statut === 'ANNULE'
                                  ? 'error'
                                  : 'default'
                              }
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                    Aucun rendez-vous à venir
                  </Typography>
                )}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/patient/rendezvous')}
              >
                Voir tous mes rendez-vous
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {}
        <Grid item xs={12} md={donneesConstantes.length > 0 ? 4 : 6}>
          <Card
            sx={{
              background: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              mb: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MedicalIcon sx={{ fontSize: 32, color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Mes consultations récentes
                </Typography>
              </Box>
              <List>
                {consultations?.data?.length > 0 ? (
                  consultations.data.slice(0, 3).map((consultation) => (
                    <ListItem
                      key={consultation.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <ListItemText
                        primary={new Date(consultation.dateHeure).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {consultation.diagnostic || 'Consultation'}
                            </Typography>
                            {consultation.typeConsultation && (
                              <Chip
                                label={consultation.typeConsultation}
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
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                    Aucune consultation récente
                  </Typography>
                )}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/patient/consultations')}
              >
                Voir toutes mes consultations
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {}
        <Grid item xs={12} md={donneesConstantes.length > 0 ? 4 : 6}>
          <Card
            sx={{
              background: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ReceiptIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Mes factures
                </Typography>
              </Box>
              <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                {bills?.data?.length || 0}
              </Typography>
              {facturesEnAttente.length > 0 && (
                <Chip
                  label={`${facturesEnAttente.length} en attente`}
                  color="warning"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/patient/factures')}
              >
                Voir mes factures
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardPatient;

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
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  AccountCircle as UserIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { patientsService } from '../../api/patients';
import { rendezvousService } from '../../api/rendezvous';
import { utilisateursService } from '../../api/utilisateurs';
import { consultationsService } from '../../api/consultations';
import { hospitalisationsService } from '../../api/hospitalisations';
import { facturesService } from '../../api/factures';
import { paiementsService } from '../../api/paiements';
import apiClient from '../../api/axios';
import CarteStatistique from '../../components/shared/CarteStatistique';
import {
  combineActivityData,
  calculateRepartitionData,
  groupConsultationsByMonth,
  calculateVariation,
  calculateTrendData,
  calculateTrendDataFromCount,
} from '../../utils/dataTransformers';
const DashboardAdmin = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: utilisateurs, isLoading: utilisateursLoading } = useQuery(
    'utilisateurs',
    utilisateursService.getAll
  );
  const { data: patients, isLoading: patientsLoading } = useQuery(
    'patients',
    patientsService.getAll
  );
  const { data: rendezvous, isLoading: rendezvousLoading } = useQuery(
    'rendezvous',
    rendezvousService.getAll
  );
  const { data: consultations, isLoading: consultationsLoading } = useQuery(
    'consultations',
    consultationsService.getAll
  );
  const { data: hospitalisations, isLoading: hospitalisationsLoading } = useQuery(
    'hospitalisations',
    hospitalisationsService.getAll
  );
  const { data: factures, isLoading: facturesLoading } = useQuery(
    'factures',
    facturesService.getAll
  );
  const { data: paiements, isLoading: paiementsLoading } = useQuery(
    'paiements',
    paiementsService.getAll
  );
  if (utilisateursLoading || patientsLoading || rendezvousLoading || consultationsLoading || hospitalisationsLoading || facturesLoading || paiementsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const nombreUtilisateurs = utilisateurs?.data?.length || 0;
  const nombrePatients = patients?.data?.length || 0;
  const nombreRendezVous = rendezvous?.data?.length || 0;
  const nombreConsultations = consultations?.data?.length || 0;
  const nombreHospitalisations = hospitalisations?.data?.length || 0;
  const nombreFactures = factures?.data?.length || 0;
  const nombrePaiements = paiements?.data?.length || 0;
  const facturesData = Array.isArray(factures?.data) ? factures.data : Array.isArray(factures) ? factures : [];
  const paiementsData = Array.isArray(paiements?.data) ? paiements.data : Array.isArray(paiements) ? paiements : [];
  const montantTotalFactures = facturesData.reduce((sum, f) => sum + (f.montantTotal || 0), 0);
  const montantTotalPaiements = paiementsData.reduce((sum, p) => sum + (p.montant || 0), 0);
  const montantImpaye = montantTotalFactures - montantTotalPaiements;
  const aujourdhui = new Date();
  const aujourdhuiStr = aujourdhui.toDateString();
  const rendezvousAujourdhui = rendezvous?.data?.filter((rdv) => {
    if (!rdv.dateHeure) return false;
    const dateRdv = new Date(rdv.dateHeure);
    return dateRdv.toDateString() === aujourdhuiStr;
  }) || [];
  const consultationsAujourdhui = consultations?.data?.filter((consultation) => {
    if (!consultation.dateHeure) return false;
    const dateConsultation = new Date(consultation.dateHeure);
    return dateConsultation.toDateString() === aujourdhuiStr;
  }) || [];
  const ilYASemaine = new Date(aujourdhui);
  ilYASemaine.setDate(ilYASemaine.getDate() - 7);
  const rendezvousSemaineDerniere = rendezvous?.data?.filter((rdv) => {
    if (!rdv.dateHeure) return false;
    const dateRdv = new Date(rdv.dateHeure);
    return dateRdv >= ilYASemaine && dateRdv < aujourdhui;
  }).length || 0;
  const consultationsSemaineDerniere = consultations?.data?.filter((consultation) => {
    if (!consultation.dateHeure) return false;
    const dateConsultation = new Date(consultation.dateHeure);
    return dateConsultation >= ilYASemaine && dateConsultation < aujourdhui;
  }).length || 0;
  const rendezvousCetteSemaine = rendezvous?.data?.filter((rdv) => {
    if (!rdv.dateHeure) return false;
    const dateRdv = new Date(rdv.dateHeure);
    return dateRdv >= ilYASemaine;
  }).length || 0;
  const variationUtilisateurs = nombreUtilisateurs > 0 ? '+12%' : '0%';
  const variationPatients = nombrePatients > 0 ? '+8%' : '0%';
  const variationRendezVous = rendezvousAujourdhui.length > 0 
    ? `Aujourd'hui: ${rendezvousAujourdhui.length}` 
    : rendezvousCetteSemaine > 0 
    ? calculateVariation(rendezvousCetteSemaine, rendezvousSemaineDerniere)
    : 'Aujourd\'hui';
  const variationConsultations = consultationsAujourdhui.length > 0 
    ? `Aujourd'hui: ${consultationsAujourdhui.length}` 
    : consultationsSemaineDerniere > 0
    ? calculateVariation(consultations?.data?.length || 0, consultationsSemaineDerniere)
    : '+5%';
  const variationHospitalisations = nombreHospitalisations > 0 ? 'En cours' : '0';
  const donneesActivite = combineActivityData(
    rendezvous?.data || [],
    patients?.data || [],
    utilisateurs?.data || []
  );
  const donneesRepartition = calculateRepartitionData(
    patients?.data || [],
    utilisateurs?.data || [],
    rendezvous?.data || [],
    consultations?.data || []
  );
  const totalRepartitionCalculated = 
    (patients?.data?.length || 0) + 
    (utilisateurs?.data?.length || 0) + 
    (rendezvous?.data?.length || 0) + 
    (consultations?.data?.length || 0);
  const donneesTendances = groupConsultationsByMonth(
    consultations?.data || [],
    hospitalisations?.data || []
  );
  const totalSessions = nombreConsultations + nombreRendezVous;
  const totalTendances = donneesTendances.reduce((sum, item) => sum + item.consultations + item.hospitalisations, 0);
  const chartColors = {
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    text: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    primary: '#1976d2',
    secondary: '#2e7d32',
    warning: '#ed6c02',
    error: '#d32f2f',
    info: '#0288d1',
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tableau de bord - Administrateur
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <CarteStatistique
            titre="Utilisateurs"
            valeur={nombreUtilisateurs}
            icone={<UserIcon />}
            couleur="primary"
            variation={variationUtilisateurs}
            tendance={calculateTrendData(utilisateurs?.data || [], 'dateCreation')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <CarteStatistique
            titre="Patients"
            valeur={nombrePatients}
            icone={<PeopleIcon />}
            couleur="success"
            variation={variationPatients}
            tendance={calculateTrendData(patients?.data || [], 'dateCreation')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <CarteStatistique
            titre="Rendez-vous"
            valeur={nombreRendezVous}
            icone={<CalendarIcon />}
            couleur="warning"
            variation={variationRendezVous}
            tendance={calculateTrendData(rendezvous?.data || [], 'dateHeure')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <CarteStatistique
            titre="Consultations"
            valeur={nombreConsultations}
            icone={<AssignmentIcon />}
            couleur="info"
            variation={variationConsultations}
            tendance={calculateTrendData(consultations?.data || [], 'dateHeure')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <CarteStatistique
            titre="Hospitalisations"
            valeur={nombreHospitalisations}
            icone={<HospitalIcon />}
            couleur="error"
            variation={variationHospitalisations}
            tendance={calculateTrendData(hospitalisations?.data || [], 'dateAdmission')}
          />
        </Grid>
      </Grid>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <CarteStatistique
            titre="Total Factures"
            valeur={nombreFactures}
            sousTitre={`${(montantTotalFactures / 1000).toFixed(1)}k MAD`}
            icone={<ReceiptIcon />}
            couleur="primary"
            variation={`${nombreFactures} factures`}
            tendance={calculateTrendData(facturesData || [], 'dateFacturation')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CarteStatistique
            titre="Paiements Reçus"
            valeur={nombrePaiements}
            sousTitre={`${(montantTotalPaiements / 1000).toFixed(1)}k MAD`}
            icone={<PaymentIcon />}
            couleur="success"
            variation={`${nombrePaiements} paiements`}
            tendance={calculateTrendData(paiementsData || [], 'datePaiement')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CarteStatistique
            titre="Montant Impayé"
            valeur={`${(montantImpaye / 1000).toFixed(1)}k`}
            sousTitre="MAD"
            icone={<MoneyOffIcon />}
            couleur="error"
            variation={montantImpaye > 0 ? `${((montantImpaye / montantTotalFactures) * 100).toFixed(0)}% du total` : 'Aucun impayé'}
          />
        </Grid>
      </Grid>
      {}
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Sessions
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {totalSessions}
                  </Typography>
                  <Chip
                    variant="outlined"
                    icon={<TrendingUpIcon />}
                    label={totalSessions > 0 ? '+35%' : '0%'}
                    size="small"
                    color="success"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 600,
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
                  Activité hebdomadaire (7 derniers jours)
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={donneesActivite}>
                  <defs>
                    <linearGradient id="colorUtilisateurs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRendezVous" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.warning} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.warning} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis
                    dataKey="nom"
                    stroke={chartColors.text}
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis
                    stroke={chartColors.text}
                    style={{ fontSize: '0.75rem' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#0c1017' : '#ffffff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: 8,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: chartColors.text }}
                  />
                  <Area
                    type="monotone"
                    dataKey="utilisateurs"
                    stackId="1"
                    stroke={chartColors.primary}
                    fill="url(#colorUtilisateurs)"
                    name="Utilisateurs actifs"
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stackId="1"
                    stroke={chartColors.secondary}
                    fill="url(#colorPatients)"
                    name="Nouveaux patients"
                  />
                  <Area
                    type="monotone"
                    dataKey="rendezvous"
                    stackId="1"
                    stroke={chartColors.warning}
                    fill="url(#colorRendezVous)"
                    name="Rendez-vous"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Répartition
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {totalRepartitionCalculated}
                  </Typography>
                  <Chip
                    variant="outlined"
                    icon={<TrendingUpIcon />}
                    label={totalRepartitionCalculated > 0 ? '+15%' : '0%'}
                    size="small"
                    color="success"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 600,
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
                  Répartition des données par catégorie
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={donneesRepartition}>
                  <defs>
                    <linearGradient id="colorRepartitionPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRepartitionUtilisateurs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRepartitionRendezVous" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.warning} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.warning} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRepartitionConsultations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9c27b0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis
                    dataKey="nom"
                    stroke={chartColors.text}
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis
                    stroke={chartColors.text}
                    style={{ fontSize: '0.75rem' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#0c1017' : '#ffffff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: 8,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: chartColors.text }}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stackId="1"
                    stroke={chartColors.primary}
                    fill="url(#colorRepartitionPatients)"
                    name="Patients"
                  />
                  <Area
                    type="monotone"
                    dataKey="utilisateurs"
                    stackId="1"
                    stroke={chartColors.secondary}
                    fill="url(#colorRepartitionUtilisateurs)"
                    name="Utilisateurs"
                  />
                  <Area
                    type="monotone"
                    dataKey="rendezvous"
                    stackId="1"
                    stroke={chartColors.warning}
                    fill="url(#colorRepartitionRendezVous)"
                    name="Rendez-vous"
                  />
                  <Area
                    type="monotone"
                    dataKey="consultations"
                    stackId="1"
                    stroke="#9c27b0"
                    fill="url(#colorRepartitionConsultations)"
                    name="Consultations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {}
        <Grid item xs={12}>
          <Card
            sx={{
              background: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Tendances mensuelles
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {totalTendances}
                  </Typography>
                  <Chip
                    variant="outlined"
                    icon={<TrendingUpIcon />}
                    label={totalTendances > 0 ? '+28%' : '0%'}
                    size="small"
                    color="success"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 600,
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
                  Consultations et hospitalisations pour les 6 derniers mois
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={donneesTendances}>
                  <defs>
                    <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorHospitalisations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.error} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartColors.error} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis
                    dataKey="mois"
                    stroke={chartColors.text}
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis
                    stroke={chartColors.text}
                    style={{ fontSize: '0.75rem' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#0c1017' : '#ffffff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: 8,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: chartColors.text }}
                  />
                  <Area
                    type="monotone"
                    dataKey="consultations"
                    stackId="1"
                    stroke={chartColors.primary}
                    fill="url(#colorConsultations)"
                    name="Consultations"
                  />
                  <Area
                    type="monotone"
                    dataKey="hospitalisations"
                    stackId="1"
                    stroke={chartColors.error}
                    fill="url(#colorHospitalisations)"
                    name="Hospitalisations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardAdmin;

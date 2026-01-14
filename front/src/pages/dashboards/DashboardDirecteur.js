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
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { statsService } from '../../api/stats';
import CarteStatistique from '../../components/shared/CarteStatistique';
const DashboardDirecteur = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: dashboardStats, isLoading } = useQuery(
    'dashboardStats',
    statsService.getDashboardStats
  );
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const stats = dashboardStats?.data || {};
  const nombrePatients = stats.totalPatients || 0;
  const nombreConsultations = stats.totalConsultations || 0;
  const nombreHospitalisations = stats.hospitalisationsEnCours || 0;
  const nouveauxPatientsCeMois = stats.nouveauxPatientsCeMois || 0;
  const rendezVousAujourdhui = stats.rendezVousAujourdhui || 0;
  const rendezVousEnAttente = stats.rendezVousEnAttente || 0;
  const litsDisponibles = stats.litsDisponibles || 0;
  const litsOccupes = stats.litsOccupes || 0;
  const tauxOccupation = stats.tauxOccupation || 0;
  const chiffreAffairesMois = stats.chiffreAffairesMois || 0;
  const facturesEnAttente = stats.facturesEnAttente || 0;
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tableau de bord - Directeur
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Total patients"
            valeur={nombrePatients}
            icone={<PeopleIcon />}
            couleur="primary"
            variation={nouveauxPatientsCeMois > 0 ? `+${nouveauxPatientsCeMois} ce mois` : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Consultations"
            valeur={nombreConsultations}
            icone={<MedicalIcon />}
            couleur="success"
            variation={`${rendezVousAujourdhui} aujourd'hui`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Hospitalisations"
            valeur={nombreHospitalisations}
            icone={<HospitalIcon />}
            couleur="error"
            variation={`${litsOccupes}/${litsOccupes + litsDisponibles} lits occupés`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Taux d'occupation"
            valeur={`${tauxOccupation.toFixed(1)}%`}
            icone={<AssessmentIcon />}
            couleur="info"
            variation={`${litsDisponibles} lits disponibles`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Rendez-vous en attente"
            valeur={rendezVousEnAttente}
            icone={<AssessmentIcon />}
            couleur="warning"
            variation={`${rendezVousAujourdhui} aujourd'hui`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Chiffre d'affaires"
            valeur={`${chiffreAffairesMois.toLocaleString('fr-FR')} MAD`}
            icone={<AssessmentIcon />}
            couleur="success"
            variation="Ce mois"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Factures en attente"
            valeur={facturesEnAttente}
            icone={<AssessmentIcon />}
            couleur="error"
            variation="À traiter"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
      </Grid>
    </Box>
  );
};
export default DashboardDirecteur;

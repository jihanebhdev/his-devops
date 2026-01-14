import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  LocalHospital as HospitalIcon,
  Favorite as FavoriteIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { consultationsService } from '../../api/consultations';
import { rendezvousService } from '../../api/rendezvous';
import { dossiersService } from '../../api/dossiers';
import { constantesService } from '../../api/constantes';
import { hospitalisationsService } from '../../api/hospitalisations';
import { facturesService } from '../../api/factures';
import { paiementsService } from '../../api/paiements';
import { useAuth } from '../../contexts/AuthContext';
import CarteStatistique from '../../components/shared/CarteStatistique';
import { groupByMonth, groupByLast7Days, calculateTrendData } from '../../utils/dataTransformers';
const DetailsPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { hasRole } = useAuth();
  const [ongletActif, setOngletActif] = useState(0);
  const { data: patientData, isLoading: patientLoading } = useQuery(
    ['patient', id],
    () => patientsService.getById(id)
  );
  const { data: consultationsData, isLoading: consultationsLoading } = useQuery(
    ['consultations', id],
    () => consultationsService.getByPatient(id)
  );
  const { data: rendezvousData, isLoading: rendezvousLoading } = useQuery(
    ['rendezvous', id],
    () => rendezvousService.getByPatient(id)
  );
  const { data: dossierData, isLoading: dossierLoading } = useQuery(
    ['dossier', id],
    () => dossiersService.getByPatient(id)
  );
  const { data: constantesData, isLoading: constantesLoading } = useQuery(
    ['constantes', id],
    () => constantesService.getByPatient(id)
  );
  const { data: hospitalisationsData, isLoading: hospitalisationsLoading } = useQuery(
    ['hospitalisations', id],
    () => hospitalisationsService.getByPatient(id)
  );
  const { data: facturesData, isLoading: facturesLoading } = useQuery(
    ['factures', id],
    () => facturesService.getByPatient(id)
  );
  const { data: paiementsData, isLoading: paiementsLoading } = useQuery(
    ['paiements', id],
    () => paiementsService.getByPatient(id)
  );
  const isLoading =
    patientLoading ||
    consultationsLoading ||
    rendezvousLoading ||
    dossierLoading ||
    constantesLoading ||
    hospitalisationsLoading ||
    facturesLoading ||
    paiementsLoading;
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const patient = patientData?.data || patientData;
  const consultations = Array.isArray(consultationsData?.data) 
    ? consultationsData.data 
    : Array.isArray(consultationsData) 
    ? consultationsData 
    : [];
  const rendezvous = Array.isArray(rendezvousData?.data) 
    ? rendezvousData.data 
    : Array.isArray(rendezvousData) 
    ? rendezvousData 
    : [];
  const dossier = dossierData?.data || dossierData;
  const constantes = Array.isArray(constantesData?.data) 
    ? constantesData.data 
    : Array.isArray(constantesData) 
    ? constantesData 
    : [];
  const hospitalisations = Array.isArray(hospitalisationsData?.data) 
    ? hospitalisationsData.data 
    : Array.isArray(hospitalisationsData) 
    ? hospitalisationsData 
    : [];
  const factures = Array.isArray(facturesData?.data) 
    ? facturesData.data 
    : Array.isArray(facturesData) 
    ? facturesData 
    : [];
  const paiements = Array.isArray(paiementsData?.data) 
    ? paiementsData.data 
    : Array.isArray(paiementsData) 
    ? paiementsData 
    : [];
  if (!patient) {
    return (
      <Box>
        <Alert severity="error">Patient non trouvé</Alert>
      </Box>
    );
  }
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const formaterDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const nombreConsultations = consultations.length;
  const nombreRendezVous = rendezvous.length;
  const nombreHospitalisations = hospitalisations.length;
  const nombreFactures = factures.length;
  const montantTotalFactures = factures.reduce((sum, f) => sum + (f.montantTotal || 0), 0);
  const montantTotalPaiements = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
  const soldeRestant = montantTotalFactures - montantTotalPaiements;
  const consultationsParMois = groupByMonth(consultations, 'dateHeure');
  const rendezvousParMois = groupByMonth(rendezvous, 'dateHeure');
  const constantesParDate = constantes
    .slice(-10)
    .map((c) => ({
      date: new Date(c.dateHeure).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      temperature: c.temperature || 0,
      tensionSystolique: c.tensionArterielleSystolique || 0,
      tensionDiastolique: c.tensionArterielleDiastolique || 0,
      frequenceCardiaque: c.frequenceCardiaque || 0,
      poids: c.poids || 0,
    }));
  const constantesPourGraphiques = constantes
    .sort((a, b) => new Date(a.dateHeure) - new Date(b.dateHeure))
    .map((c) => ({
      date: new Date(c.dateHeure).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      dateComplete: new Date(c.dateHeure).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      temperature: c.temperature || null,
      tensionSystolique: c.tensionArterielleSystolique || null,
      tensionDiastolique: c.tensionArterielleDiastolique || null,
      frequenceCardiaque: c.frequenceCardiaque || null,
      poids: c.poids || null,
      frequenceRespiratoire: c.frequenceRespiratoire || null,
    }));
  const chartColors = {
    primary: isDark ? '#42a5f5' : '#1976d2',
    secondary: isDark ? '#ff5983' : '#dc004e',
    success: isDark ? '#4caf50' : '#2e7d32',
    warning: isDark ? '#ff9800' : '#ed6c02',
    text: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };
  const onglets = [
    { label: 'Vue d\'ensemble', value: 0 },
    { label: 'Dossier Médical', value: 1 },
    { label: 'Consultations', value: 2 },
    { label: 'Rendez-vous', value: 3 },
    { label: 'Constantes Vitales', value: 4 },
    { label: 'Hospitalisations', value: 5 },
    { label: 'Factures & Paiements', value: 6 },
  ];
  return (
    <Box>
      {}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          variant="outlined"
        >
          Retour
        </Button>
      </Box>
      {}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '2rem',
                }}
              >
                {patient.prenom?.charAt(0)?.toUpperCase()}
                {patient.nom?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {patient.prenom} {patient.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  ID: {patient.numeroIdentification || patient.id}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={patient.sexe} size="small" variant="outlined" />
                  <Chip
                    label={`Né(e) le ${formaterDate(patient.dateNaissance)}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL')) && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/patients/${id}/modifier`)}
                >
                  Modifier Patient
                </Button>
              )}
              {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
                <Button
                  variant="contained"
                  startIcon={dossier ? <EditIcon /> : <AssignmentIcon />}
                  onClick={() => {
                    if (dossier?.id) {
                      navigate(`/dossiers/${dossier.id}/modifier`);
                    } else {
                      navigate(`/dossiers/patient/${id}/nouveau`);
                    }
                  }}
                  color={dossier ? 'primary' : 'success'}
                >
                  {dossier ? 'Modifier Dossier Médical' : 'Créer Dossier Médical'}
                </Button>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Téléphone
              </Typography>
              <Typography variant="body1">{patient.telephone || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{patient.email || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Adresse
              </Typography>
              <Typography variant="body1">{patient.adresse || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Groupe Sanguin
              </Typography>
              <Typography variant="body1">{dossier?.groupeSanguin || '-'}</Typography>
            </Grid>
            {patient.antecedentsMedicaux && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Antécédents médicaux
                </Typography>
                <Typography variant="body1">{patient.antecedentsMedicaux}</Typography>
              </Grid>
            )}
            {patient.allergies && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Allergies
                </Typography>
                <Typography variant="body1" color="error">
                  {patient.allergies}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      {}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Consultations"
            valeur={nombreConsultations}
            icone={<MedicalIcon />}
            couleur="primary"
            tendance={calculateTrendData(consultations, 'dateHeure')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Rendez-vous"
            valeur={nombreRendezVous}
            icone={<CalendarIcon />}
            couleur="info"
            tendance={calculateTrendData(rendezvous, 'dateHeure')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Hospitalisations"
            valeur={nombreHospitalisations}
            icone={<HospitalIcon />}
            couleur="warning"
            tendance={calculateTrendData(hospitalisations, 'dateAdmission')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Constantes Vitales"
            valeur={constantes.length}
            icone={<FavoriteIcon />}
            couleur="error"
            tendance={calculateTrendData(constantes, 'dateHeure')}
            sousTitre={constantes.length > 0 ? `Dernière: ${new Date(constantes[constantes.length - 1]?.dateHeure).toLocaleDateString('fr-FR')}` : 'Aucune mesure'}
          />
        </Grid>
      </Grid>
      {}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={ongletActif}
            onChange={(e, newValue) => setOngletActif(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {onglets.map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        <CardContent>
          {}
          {ongletActif === 0 && (
            <Grid container spacing={3}>
              {}
              {!dossier && (hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
                <Grid item xs={12}>
                  <Alert 
                    severity="warning" 
                    action={
                      <Button 
                        color="inherit" 
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={() => navigate(`/dossiers/patient/${id}/nouveau`)}
                      >
                        Créer maintenant
                      </Button>
                    }
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Aucun dossier médical pour ce patient
                    </Typography>
                    <Typography variant="body2">
                      Créez un dossier médical pour enregistrer les informations médicales importantes (groupe sanguin, allergies, antécédents, etc.)
                    </Typography>
                  </Alert>
                </Grid>
              )}
              {}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: isDark ? '#0c1017' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Consultations par mois
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={consultationsParMois}>
                        <defs>
                          <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                        <XAxis dataKey="mois" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                        <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                        <Tooltip
                          contentStyle={{
                            background: isDark ? '#0c1017' : '#ffffff',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 4,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={chartColors.primary}
                          fill="url(#colorConsultations)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              {}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: isDark ? '#0c1017' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Rendez-vous par mois
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={rendezvousParMois}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                        <XAxis dataKey="mois" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                        <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                        <Tooltip
                          contentStyle={{
                            background: isDark ? '#0c1017' : '#ffffff',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 4,
                          }}
                        />
                        <Bar dataKey="value" fill={chartColors.info} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              {}
              {constantesParDate.length > 0 && (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: isDark ? '#0c1017' : '#ffffff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Évolution des constantes vitales
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={constantesParDate}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                          <XAxis dataKey="date" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                          <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                          <Tooltip
                            contentStyle={{
                              background: isDark ? '#0c1017' : '#ffffff',
                              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                              borderRadius: 4,
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke={chartColors.error}
                            name="Température (°C)"
                          />
                          <Line
                            type="monotone"
                            dataKey="tensionSystolique"
                            stroke={chartColors.primary}
                            name="Tension Systolique"
                          />
                          <Line
                            type="monotone"
                            dataKey="frequenceCardiaque"
                            stroke={chartColors.success}
                            name="Fréquence Cardiaque"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
          {}
          {ongletActif === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Dossier Médical
                </Typography>
                {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      if (dossier?.id) {
                        navigate(`/dossiers/${dossier.id}/modifier`);
                      } else {
                        navigate(`/dossiers/patient/${id}/nouveau`);
                      }
                    }}
                  >
                    {dossier ? 'Modifier le dossier' : 'Créer le dossier'}
                  </Button>
                )}
              </Box>
              {dossier ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Informations médicales
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Groupe Sanguin
                      </Typography>
                      <Typography variant="body1">
                        {dossier.groupeSanguin || '-'} {dossier.rhesus ? `(${dossier.rhesus})` : ''}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Historique médical
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {dossier.historiqueMedical || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Notes cliniques
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {dossier.notesCliniques || '-'}
                    </Typography>
                  </Grid>
                  {}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Constantes Vitales
                      </Typography>
                      {(hasRole('ADMINISTRATEUR') || hasRole('INFIRMIER') || hasRole('MEDECIN')) && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<FavoriteIcon />}
                          onClick={() => navigate(`/constantes-vitales/nouvelle?patientId=${id}`)}
                        >
                          Ajouter constantes
                        </Button>
                      )}
                    </Box>
                    {constantes.length > 0 ? (
                      <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Temp. (°C)</TableCell>
                              <TableCell>Tension (mmHg)</TableCell>
                              <TableCell>Pouls (bpm)</TableCell>
                              <TableCell>Poids (kg)</TableCell>
                              <TableCell>Notes</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {constantes.slice(0, 5).map((constante) => (
                              <TableRow key={constante.id} hover>
                                <TableCell>{formaterDateTime(constante.dateHeure)}</TableCell>
                                <TableCell>{constante.temperature || '-'}</TableCell>
                                <TableCell>
                                  {constante.tensionArterielleSystolique && constante.tensionArterielleDiastolique
                                    ? `${constante.tensionArterielleSystolique}/${constante.tensionArterielleDiastolique}`
                                    : '-'}
                                </TableCell>
                                <TableCell>{constante.frequenceCardiaque || '-'}</TableCell>
                                <TableCell>{constante.poids || '-'}</TableCell>
                                <TableCell>
                                  {constante.notes ? (
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                      {constante.notes}
                                    </Typography>
                                  ) : '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Aucune constante vitale enregistrée
                      </Alert>
                    )}
                    {constantes.length > 5 && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="text"
                          onClick={() => {
                            const vitalSignsTabIndex = onglets.findIndex(tab => tab.value === 4);
                            if (vitalSignsTabIndex !== -1) {
                              setOngletActif(4);
                            }
                          }}
                        >
                          Voir toutes les constantes ({constantes.length})
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Aucun dossier médical disponible
                    {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/dossiers/patient/${id}/nouveau`)}
                      >
                        Créer le dossier médical
                      </Button>
                    </Box>
                  )}
                  </Alert>
                  {}
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Constantes Vitales
                      </Typography>
                      {(hasRole('ADMINISTRATEUR') || hasRole('INFIRMIER') || hasRole('MEDECIN')) && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<FavoriteIcon />}
                          onClick={() => navigate(`/constantes-vitales/nouvelle?patientId=${id}`)}
                        >
                          Ajouter constantes
                        </Button>
                      )}
                    </Box>
                    {constantes.length > 0 ? (
                      <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Temp. (°C)</TableCell>
                              <TableCell>Tension (mmHg)</TableCell>
                              <TableCell>Pouls (bpm)</TableCell>
                              <TableCell>Poids (kg)</TableCell>
                              <TableCell>Notes</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {constantes.slice(0, 5).map((constante) => (
                              <TableRow key={constante.id} hover>
                                <TableCell>{formaterDateTime(constante.dateHeure)}</TableCell>
                                <TableCell>{constante.temperature || '-'}</TableCell>
                                <TableCell>
                                  {constante.tensionArterielleSystolique && constante.tensionArterielleDiastolique
                                    ? `${constante.tensionArterielleSystolique}/${constante.tensionArterielleDiastolique}`
                                    : '-'}
                                </TableCell>
                                <TableCell>{constante.frequenceCardiaque || '-'}</TableCell>
                                <TableCell>{constante.poids || '-'}</TableCell>
                                <TableCell>
                                  {constante.notes ? (
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                      {constante.notes}
                                    </Typography>
                                  ) : '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Aucune constante vitale enregistrée
                      </Alert>
                    )}
                    {constantes.length > 5 && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="text"
                          onClick={() => setOngletActif(4)}
                        >
                          Voir toutes les constantes ({constantes.length})
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {}
          {ongletActif === 2 && (
            <Box>
              {consultations.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Médecin</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Diagnostic</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {consultations.map((consultation) => (
                        <TableRow key={consultation.id} hover>
                          <TableCell>{formaterDateTime(consultation.dateHeure)}</TableCell>
                          <TableCell>
                            {consultation.medecin?.prenom} {consultation.medecin?.nom}
                          </TableCell>
                          <TableCell>{consultation.typeConsultation || '-'}</TableCell>
                          <TableCell>{consultation.diagnostic || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">Aucune consultation enregistrée</Alert>
              )}
            </Box>
          )}
          {}
          {ongletActif === 3 && (
            <Box>
              {rendezvous.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date/Heure</TableCell>
                        <TableCell>Médecin</TableCell>
                        <TableCell>Motif</TableCell>
                        <TableCell>Statut</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rendezvous.map((rdv) => (
                        <TableRow key={rdv.id} hover>
                          <TableCell>{formaterDateTime(rdv.dateHeure)}</TableCell>
                          <TableCell>
                            {rdv.medecin?.prenom} {rdv.medecin?.nom}
                          </TableCell>
                          <TableCell>{rdv.motif || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={rdv.statut}
                              size="small"
                              variant="outlined"
                              color={
                                rdv.statut === 'CONFIRME'
                                  ? 'success'
                                  : rdv.statut === 'ANNULE'
                                  ? 'error'
                                  : 'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">Aucun rendez-vous enregistré</Alert>
              )}
            </Box>
          )}
          {}
          {ongletActif === 4 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Constantes Vitales
                </Typography>
              </Box>
              {constantes.length > 0 ? (
                <Grid container spacing={3}>
                  {}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: isDark ? '#0c1017' : '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Température (°C)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={constantesPourGraphiques}>
                            <defs>
                              <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff5983" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ff5983" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="date" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                              contentStyle={{
                                background: isDark ? '#0c1017' : '#ffffff',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: 4,
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="temperature"
                              stroke="#ff5983"
                              fill="url(#colorTemperature)"
                              name="Température (°C)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  {}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: isDark ? '#0c1017' : '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Tension Artérielle (mmHg)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={constantesPourGraphiques}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="date" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                              contentStyle={{
                                background: isDark ? '#0c1017' : '#ffffff',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: 4,
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="tensionSystolique"
                              stroke={chartColors.primary}
                              name="Systolique"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="tensionDiastolique"
                              stroke={chartColors.secondary}
                              name="Diastolique"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  {}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: isDark ? '#0c1017' : '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Fréquence Cardiaque (bpm)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={constantesPourGraphiques}>
                            <defs>
                              <linearGradient id="colorFrequenceCardiaque" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={chartColors.success} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="date" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                              contentStyle={{
                                background: isDark ? '#0c1017' : '#ffffff',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: 4,
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="frequenceCardiaque"
                              stroke={chartColors.success}
                              fill="url(#colorFrequenceCardiaque)"
                              name="Fréquence Cardiaque (bpm)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  {}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: isDark ? '#0c1017' : '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Poids (kg)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={constantesPourGraphiques}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="date" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <YAxis stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                              contentStyle={{
                                background: isDark ? '#0c1017' : '#ffffff',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: 4,
                              }}
                            />
                            <Bar dataKey="poids" fill={chartColors.warning} name="Poids (kg)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  {}
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        background: isDark ? '#0c1017' : '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          Vue d'ensemble des constantes vitales
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={constantesPourGraphiques}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="date" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <YAxis yAxisId="left" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <YAxis yAxisId="right" orientation="right" stroke={chartColors.text} style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                              contentStyle={{
                                background: isDark ? '#0c1017' : '#ffffff',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: 4,
                              }}
                            />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="temperature"
                              stroke="#ff5983"
                              name="Température (°C)"
                              strokeWidth={2}
                            />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="tensionSystolique"
                              stroke={chartColors.primary}
                              name="Tension Systolique (mmHg)"
                              strokeWidth={2}
                            />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="tensionDiastolique"
                              stroke={chartColors.secondary}
                              name="Tension Diastolique (mmHg)"
                              strokeWidth={2}
                            />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="frequenceCardiaque"
                              stroke={chartColors.success}
                              name="Fréquence Cardiaque (bpm)"
                              strokeWidth={2}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="poids"
                              stroke={chartColors.warning}
                              name="Poids (kg)"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  {}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Historique détaillé
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date/Heure</TableCell>
                            <TableCell>Température (°C)</TableCell>
                            <TableCell>Tension Systolique (mmHg)</TableCell>
                            <TableCell>Tension Diastolique (mmHg)</TableCell>
                            <TableCell>Fréquence Cardiaque (bpm)</TableCell>
                            <TableCell>Poids (kg)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {constantes.slice().reverse().slice(0, 20).map((constante) => (
                            <TableRow key={constante.id} hover>
                              <TableCell>{formaterDateTime(constante.dateHeure)}</TableCell>
                              <TableCell>{constante.temperature || '-'} {constante.temperature ? '°C' : ''}</TableCell>
                              <TableCell>{constante.tensionArterielleSystolique || '-'}</TableCell>
                              <TableCell>{constante.tensionArterielleDiastolique || '-'}</TableCell>
                              <TableCell>{constante.frequenceCardiaque || '-'} {constante.frequenceCardiaque ? 'bpm' : ''}</TableCell>
                              <TableCell>{constante.poids || '-'} {constante.poids ? 'kg' : ''}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">Aucune constante vitale enregistrée</Alert>
              )}
            </Box>
          )}
          {}
          {ongletActif === 5 && (
            <Box>
              {hospitalisations.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date Admission</TableCell>
                        <TableCell>Date Sortie</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Lit</TableCell>
                        <TableCell>Statut</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hospitalisations.map((hosp) => (
                        <TableRow key={hosp.id} hover>
                          <TableCell>{formaterDate(hosp.dateAdmission)}</TableCell>
                          <TableCell>{hosp.dateSortie ? formaterDate(hosp.dateSortie) : 'En cours'}</TableCell>
                          <TableCell>{hosp.lit?.service || '-'}</TableCell>
                          <TableCell>{hosp.lit?.numeroLit || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={hosp.dateSortie ? 'Sorti' : 'En cours'}
                              size="small"
                              variant="outlined"
                              color={hosp.dateSortie ? 'default' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">Aucune hospitalisation enregistrée</Alert>
              )}
            </Box>
          )}
          {}
          {ongletActif === 6 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Factures
                </Typography>
                {factures.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Montant</TableCell>
                          <TableCell>Statut</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {factures.map((facture) => (
                          <TableRow key={facture.id} hover>
                            <TableCell>{formaterDate(facture.dateFacturation)}</TableCell>
                            <TableCell>{facture.montantTotal?.toFixed(2) || '0.00'} MAD</TableCell>
                            <TableCell>
                              <Chip
                                label={facture.statut || 'En attente'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">Aucune facture</Alert>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Paiements
                </Typography>
                {paiements.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Montant</TableCell>
                          <TableCell>Mode</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paiements.map((paiement) => (
                          <TableRow key={paiement.id} hover>
                            <TableCell>{formaterDate(paiement.datePaiement)}</TableCell>
                            <TableCell>{paiement.montant?.toFixed(2) || '0.00'} MAD</TableCell>
                            <TableCell>{paiement.modePaiement || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">Aucun paiement</Alert>
                )}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default DetailsPatient;

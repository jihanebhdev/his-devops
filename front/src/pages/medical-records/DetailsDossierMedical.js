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
import { dossiersService } from '../../api/dossiers';
import { patientsService } from '../../api/patients';
import { consultationsService } from '../../api/consultations';
import { rendezvousService } from '../../api/rendezvous';
import { constantesService } from '../../api/constantes';
import { hospitalisationsService } from '../../api/hospitalisations';
import { useAuth } from '../../contexts/AuthContext';
import CarteStatistique from '../../components/shared/CarteStatistique';
import { groupByMonth, calculateTrendData } from '../../utils/dataTransformers';
import { useToast } from '../../hooks/useToast';
const DetailsDossierMedical = () => {
  const { id, patientId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { hasRole } = useAuth();
  const { showError } = useToast();
  const [ongletActif, setOngletActif] = useState(0);
  const finalPatientId = patientId || id;
  const { data: dossierData, isLoading: dossierLoading } = useQuery(
    ['dossier', id, patientId],
    () => {
      if (patientId) {
        return dossiersService.getByPatient(patientId);
      }
      return dossiersService.getById(id);
    },
    { enabled: !!id || !!patientId }
  );
  const dossier = dossierData?.data || dossierData;
  const actualPatientId = dossier?.patientId || dossier?.patient?.id || patientId || id;
  const { data: patientData, isLoading: patientLoading } = useQuery(
    ['patient', actualPatientId],
    () => patientsService.getById(actualPatientId),
    { enabled: !!actualPatientId }
  );
  const { data: consultationsData, isLoading: consultationsLoading } = useQuery(
    ['consultations', actualPatientId],
    () => consultationsService.getByPatient(actualPatientId),
    { enabled: !!actualPatientId }
  );
  const { data: rendezvousData, isLoading: rendezvousLoading } = useQuery(
    ['rendezvous', actualPatientId],
    () => rendezvousService.getByPatient(actualPatientId),
    { enabled: !!actualPatientId }
  );
  const { data: constantesData, isLoading: constantesLoading } = useQuery(
    ['constantes', actualPatientId],
    () => constantesService.getByPatient(actualPatientId),
    { enabled: !!actualPatientId }
  );
  const { data: hospitalisationsData, isLoading: hospitalisationsLoading } = useQuery(
    ['hospitalisations', actualPatientId],
    () => hospitalisationsService.getByPatient(actualPatientId),
    { enabled: !!actualPatientId }
  );
  const isLoading =
    dossierLoading ||
    patientLoading ||
    consultationsLoading ||
    rendezvousLoading ||
    constantesLoading ||
    hospitalisationsLoading;
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const patient = patientData?.data || patientData;
  const consultations = consultationsData?.data || consultationsData || [];
  const rendezvous = rendezvousData?.data || rendezvousData || [];
  const constantes = constantesData?.data || constantesData || [];
  const hospitalisations = hospitalisationsData?.data || hospitalisationsData || [];
  if (!dossier) {
    return (
      <Box>
        <Alert severity="error">Dossier médical non trouvé</Alert>
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
  const nombreConstantes = constantes.length;
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
    { label: 'Informations Médicales', value: 1 },
    { label: 'Consultations', value: 2 },
    { label: 'Rendez-vous', value: 3 },
    { label: 'Constantes Vitales', value: 4 },
    { label: 'Hospitalisations', value: 5 },
  ];
  const handleEdit = () => {
    if (dossier.id) {
      navigate(`/dossiers/${dossier.id}/modifier`);
    } else if (patient?.id) {
      navigate(`/dossiers/patient/${patient.id}/nouveau`);
    } else {
      showError('Impossible de déterminer l\'ID du dossier pour l\'édition');
    }
  };
  return (
    <Box>
      {}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dossiers')}
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
                {patient?.prenom?.charAt(0)?.toUpperCase()}
                {patient?.nom?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Dossier Médical
                </Typography>
                {patient && (
                  <Typography variant="body1" color="text.secondary">
                    {patient.prenom} {patient.nom} - ID: {patient.numeroIdentification || patient.id}
                  </Typography>
                )}
              </Box>
            </Box>
            {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Modifier
              </Button>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          {}
          <Grid container spacing={3}>
            {patient && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Date de naissance
                  </Typography>
                  <Typography variant="body1">{formaterDate(patient.dateNaissance)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Sexe
                  </Typography>
                  <Typography variant="body1">{patient.sexe}</Typography>
                </Grid>
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
              </>
            )}
            {dossier.groupeSanguin && (
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Groupe Sanguin
                </Typography>
                <Typography variant="body1">
                  {dossier.groupeSanguin} {dossier.rhesus || ''}
                </Typography>
              </Grid>
            )}
            {dossier.allergies && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Allergies
                </Typography>
                <Typography variant="body1" color="error">
                  {dossier.allergies}
                </Typography>
              </Grid>
            )}
            {patient?.allergies && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Allergies (Patient)
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
            valeur={nombreConstantes}
            icone={<FavoriteIcon />}
            couleur="success"
            tendance={calculateTrendData(constantes, 'dateHeure')}
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
                    {dossier.groupeSanguin || '-'} {dossier.rhesus || ''}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Allergies
                  </Typography>
                  <Typography variant="body1" color="error">
                    {dossier.allergies || dossier.antecedents?.allergies || patient?.allergies || 'Aucune'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Antécédents médicaux
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {dossier.antecedents || dossier.historiqueMedical || patient?.antecedentsMedicaux || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Médicaments
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {dossier.medicaments || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Notes cliniques
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {dossier.notesCliniques || dossier.autresInformations || '-'}
                </Typography>
              </Grid>
            </Grid>
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
              {constantes.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date/Heure</TableCell>
                        <TableCell>Température</TableCell>
                        <TableCell>Tension</TableCell>
                        <TableCell>Fréquence Cardiaque</TableCell>
                        <TableCell>Poids</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {constantes.slice(-20).map((constante) => (
                        <TableRow key={constante.id} hover>
                          <TableCell>{formaterDateTime(constante.dateHeure)}</TableCell>
                          <TableCell>{constante.temperature || '-'} °C</TableCell>
                          <TableCell>
                            {constante.tensionArterielleSystolique || '-'}/
                            {constante.tensionArterielleDiastolique || '-'} mmHg
                          </TableCell>
                          <TableCell>{constante.frequenceCardiaque || '-'} bpm</TableCell>
                          <TableCell>{constante.poids || '-'} kg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
        </CardContent>
      </Card>
    </Box>
  );
};
export default DetailsDossierMedical;

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { facturesService } from '../../api/factures';
import { patientsService } from '../../api/patients';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import CarteStatistique from '../../components/shared/CarteStatistique';
const ListeFactures = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const [filtrePatient, setFiltrePatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: patientsData } = useQuery(
    'patients',
    patientsService.getAll,
    { enabled: hasRole('ADMINISTRATEUR') || hasRole('COMPTABLE') }
  );
  useEffect(() => {
    if (patientsData) {
      const data = patientsData.data || patientsData;
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }
    }
  }, [patientsData]);
  const { data, isLoading, refetch } = useQuery('factures', () => {
    if (hasRole('PATIENT')) {
      return facturesService.getMyFactures();
    }
    return facturesService.getAll();
  });
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries('factures'),
      queryClient.invalidateQueries('patients'),
    ]);
    await refetch();
    setIsRefreshing(false);
    showSuccess('Données actualisées');
  };
  const factures = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const facturesFiltrees = factures.filter((facture) => {
    const correspondRecherche =
      recherche === '' ||
      `${facture.patient?.nom} ${facture.patient?.prenom}`
        .toLowerCase()
        .includes(recherche.toLowerCase()) ||
      facture.numeroFacture?.toLowerCase().includes(recherche.toLowerCase()) ||
      facture.id?.toString().includes(recherche);
    const normalizedStatut = (facture.statut || 'EN_ATTENTE').toUpperCase();
    let correspondStatut = false;
    if (filtreStatut === 'TOUS') {
      correspondStatut = true;
    } else if (filtreStatut === 'PAYE') {
      correspondStatut = normalizedStatut === 'PAYE' || normalizedStatut === 'PAYEE';
    } else if (filtreStatut === 'IMPAYE') {
      correspondStatut = normalizedStatut === 'IMPAYE' || normalizedStatut === 'IMPAYEE';
    } else {
      correspondStatut = normalizedStatut === filtreStatut;
    }
    const correspondPatient = !filtrePatient || facture.patientId === filtrePatient.id;
    return correspondRecherche && correspondStatut && correspondPatient;
  });
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const getCouleurStatut = (statut) => {
    const normalizedStatut = (statut || 'EN_ATTENTE').toUpperCase();
    const couleurs = {
      PAYE: 'success',
      PAYEE: 'success',
      EN_ATTENTE: 'warning',
      IMPAYE: 'error',
      IMPAYEE: 'error',
      ANNULEE: 'default',
    };
    return couleurs[normalizedStatut] || 'warning';
  };
  const getLibelleStatut = (statut) => {
    const normalizedStatut = (statut || 'EN_ATTENTE').toUpperCase();
    const libelles = {
      PAYE: 'Payée',
      PAYEE: 'Payée',
      EN_ATTENTE: 'En attente',
      IMPAYE: 'Impayée',
      IMPAYEE: 'Impayée',
      ANNULEE: 'Annulée',
    };
    return libelles[normalizedStatut] || statut || 'En attente';
  };
  const stats = {
    total: factures.length,
    payees: factures.filter(f => ['PAYE', 'PAYEE'].includes((f.statut || '').toUpperCase())).length,
    enAttente: factures.filter(f => (f.statut || 'EN_ATTENTE').toUpperCase() === 'EN_ATTENTE').length,
    impayees: factures.filter(f => ['IMPAYE', 'IMPAYEE'].includes((f.statut || '').toUpperCase())).length,
  };
  console.log('Filter status:', filtreStatut);
  console.log('All factures:', factures.map(f => ({ id: f.id, statut: f.statut })));
  console.log('Filtered factures:', facturesFiltrees.map(f => ({ id: f.id, statut: f.statut })));
  console.log('Stats:', stats);
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des factures</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Actualiser les données">
            <IconButton
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              color="primary"
              sx={{
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <RefreshIcon sx={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }} />
            </IconButton>
          </Tooltip>
          {(hasRole('ADMINISTRATEUR') || hasRole('COMPTABLE')) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/factures/nouvelle')}
            >
              Nouvelle facture
            </Button>
          )}
        </Box>
      </Box>
      {}
      {(hasRole('ADMINISTRATEUR') || hasRole('COMPTABLE')) && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: isDark ? '#0c1017' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        mb: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Total Factures
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                      }}
                    >
                      {stats.total}
                    </Typography>
                  </Box>
                  <ReceiptIcon sx={{ fontSize: 48, color: '#1976d2', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: isDark ? '#0c1017' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        mb: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Factures Payées
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#2e7d32',
                      }}
                    >
                      {stats.payees}
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#2e7d32', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: isDark ? '#0c1017' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        mb: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      En Attente
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#ed6c02',
                      }}
                    >
                      {stats.enAttente}
                    </Typography>
                  </Box>
                  <HourglassIcon sx={{ fontSize: 48, color: '#ed6c02', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: isDark ? '#0c1017' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        mb: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Impayées
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#d32f2f',
                      }}
                    >
                      {stats.impayees}
                    </Typography>
                  </Box>
                  <CancelIcon sx={{ fontSize: 48, color: '#d32f2f', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Card
        sx={{
          backgroundColor: isDark ? '#0c1017' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: 4,
          boxShadow: 'none',
        }}
      >
        <CardContent>
          {}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Rechercher une facture..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={filtreStatut}
                    label="Statut"
                    onChange={(e) => setFiltreStatut(e.target.value)}
                    startAdornment={<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="TOUS">Tous ({factures.length})</MenuItem>
                    <MenuItem value="EN_ATTENTE">En attente ({stats.enAttente})</MenuItem>
                    <MenuItem value="PAYE">Payées ({stats.payees})</MenuItem>
                    <MenuItem value="IMPAYE">Impayées ({stats.impayees})</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {(hasRole('ADMINISTRATEUR') || hasRole('COMPTABLE')) && (
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    options={patients || []}
                    getOptionLabel={(option) => `${option.prenom || ''} ${option.nom || ''}`}
                    value={filtrePatient}
                    onChange={(event, newValue) => setFiltrePatient(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filtrer par patient"
                        placeholder="Tous les patients"
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer 
              component={Paper}
              sx={{
                backgroundColor: isDark ? '#0c1017' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: 'none',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>Numéro</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturesFiltrees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucune facture trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    facturesFiltrees.map((facture) => (
                      <TableRow 
                        key={facture.id} 
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      >
                        <TableCell>{facture.numeroFacture || facture.id}</TableCell>
                        <TableCell>
                          {facture.patient?.prenom} {facture.patient?.nom}
                        </TableCell>
                        <TableCell>{formaterDate(facture.dateFacturation)}</TableCell>
                        <TableCell>
                          {facture.montantTotal?.toLocaleString('fr-FR')} MAD
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getLibelleStatut(facture.statut)}
                            color={getCouleurStatut(facture.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/factures/${facture.id}`)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default ListeFactures;

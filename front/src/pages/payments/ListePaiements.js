import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
  CircularProgress,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Money as MoneyIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { paiementsService } from '../../api/paiements';
import { facturesService } from '../../api/factures';
import { patientsService } from '../../api/patients';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
const ListePaiements = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [recherche, setRecherche] = useState('');
  const [filtreModePaiement, setFiltreModePaiement] = useState('TOUS');
  const [filtrePatient, setFiltrePatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [factures, setFactures] = useState([]);
  const [dialogueSuppressionOuvert, setDialogueSuppressionOuvert] = useState(false);
  const [paiementASupprimer, setPaiementASupprimer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: patientsData } = useQuery(
    'patients',
    patientsService.getAll,
    { enabled: hasRole('ADMINISTRATEUR') || hasRole('COMPTABLE') }
  );
  const { data: facturesData } = useQuery('factures', facturesService.getAll);
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
  useEffect(() => {
    if (facturesData) {
      const data = facturesData.data || facturesData;
      if (Array.isArray(data)) {
        setFactures(data);
      } else {
        setFactures([]);
      }
    }
  }, [facturesData]);
  const { data, isLoading, refetch } = useQuery('paiements', () => {
    if (hasRole('PATIENT')) {
      return paiementsService.getMyPaiements();
    }
    return paiementsService.getAll();
  });
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries('paiements'),
      queryClient.invalidateQueries('factures'),
      queryClient.invalidateQueries('patients'),
    ]);
    await refetch();
    setIsRefreshing(false);
    showSuccess('Données actualisées');
  };
  const paiements = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const paiementsEnrichis = paiements.map((paiement) => {
    let enriched = { ...paiement };
    if (!paiement.facture || typeof paiement.facture !== 'object') {
      const facture = factures.find(f => f.id === paiement.factureId);
      if (facture) {
        enriched.facture = facture;
        if (!facture.patient || typeof facture.patient !== 'object') {
          const patient = patients.find(p => p.id === facture.patientId);
          if (patient) {
            enriched.facture.patient = patient;
          }
        }
      }
    }
    return enriched;
  });
  const paiementsFiltres = paiementsEnrichis.filter((paiement) => {
    const correspondRecherche =
      recherche === '' ||
      `${paiement.facture?.patient?.nom} ${paiement.facture?.patient?.prenom}`
        .toLowerCase()
        .includes(recherche.toLowerCase()) ||
      paiement.facture?.numeroFacture?.toLowerCase().includes(recherche.toLowerCase()) ||
      paiement.referenceTransaction?.toLowerCase().includes(recherche.toLowerCase()) ||
      paiement.id?.toString().includes(recherche);
    const correspondModePaiement = 
      filtreModePaiement === 'TOUS' || 
      (paiement.modePaiement || '').toUpperCase() === filtreModePaiement;
    const correspondPatient = 
      !filtrePatient || 
      paiement.facture?.patientId === filtrePatient.id;
    return correspondRecherche && correspondModePaiement && correspondPatient;
  });
  const stats = {
    total: paiements.length,
    especes: paiements.filter(p => p.modePaiement === 'ESPECES').length,
    carte: paiements.filter(p => p.modePaiement === 'CARTE_BANCAIRE').length,
    cheque: paiements.filter(p => p.modePaiement === 'CHEQUE').length,
    virement: paiements.filter(p => p.modePaiement === 'VIREMENT').length,
    montantTotal: paiements.reduce((sum, p) => sum + (p.montant || 0), 0),
  };
  const mutationSuppression = useMutation(paiementsService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('paiements');
      queryClient.invalidateQueries('factures');
      showSuccess('Paiement supprimé avec succès');
      setDialogueSuppressionOuvert(false);
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Erreur lors de la suppression du paiement');
    },
  });
  const handleOuvrirDialogueSuppression = (id) => {
    setPaiementASupprimer(id);
    setDialogueSuppressionOuvert(true);
  };
  const handleFermerDialogueSuppression = () => {
    setDialogueSuppressionOuvert(false);
    setPaiementASupprimer(null);
  };
  const handleConfirmerSuppression = () => {
    if (paiementASupprimer) {
      mutationSuppression.mutate(paiementASupprimer);
    }
  };
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  const getLibelleModePaiement = (mode) => {
    const libelles = {
      ESPECES: 'Espèces',
      CARTE_BANCAIRE: 'Carte bancaire',
      CHEQUE: 'Chèque',
      VIREMENT: 'Virement',
    };
    return libelles[mode] || mode;
  };
  const getCouleurModePaiement = (mode) => {
    const couleurs = {
      ESPECES: 'success',
      CARTE_BANCAIRE: 'primary',
      CHEQUE: 'warning',
      VIREMENT: 'info',
    };
    return couleurs[mode] || 'default';
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des paiements</Typography>
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
              onClick={() => navigate('/paiements/nouveau')}
            >
              Enregistrer un paiement
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
                      Total Paiements
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
                  <PaymentIcon sx={{ fontSize: 48, color: '#1976d2', opacity: 0.2 }} />
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
                      Montant Total
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#2e7d32',
                      }}
                    >
                      {(stats.montantTotal / 1000).toFixed(1)}k
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 48, color: '#2e7d32', opacity: 0.2 }} />
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
                      Carte Bancaire
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#0288d1',
                      }}
                    >
                      {stats.carte}
                    </Typography>
                  </Box>
                  <CreditCardIcon sx={{ fontSize: 48, color: '#0288d1', opacity: 0.2 }} />
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
                      Espèces
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#2e7d32',
                      }}
                    >
                      {stats.especes}
                    </Typography>
                  </Box>
                  <AccountBalanceIcon sx={{ fontSize: 48, color: '#2e7d32', opacity: 0.2 }} />
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
                  placeholder="Rechercher un paiement..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Mode de paiement</InputLabel>
                  <Select
                    value={filtreModePaiement}
                    label="Mode de paiement"
                    onChange={(e) => setFiltreModePaiement(e.target.value)}
                    startAdornment={<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="TOUS">Tous ({paiements.length})</MenuItem>
                    <MenuItem value="ESPECES">Espèces ({stats.especes})</MenuItem>
                    <MenuItem value="CARTE_BANCAIRE">Carte bancaire ({stats.carte})</MenuItem>
                    <MenuItem value="CHEQUE">Chèque ({stats.cheque})</MenuItem>
                    <MenuItem value="VIREMENT">Virement ({stats.virement})</MenuItem>
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
                    <TableCell sx={{ fontWeight: 600 }}>Facture</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mode de paiement</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Référence</TableCell>
                    {hasRole('ADMINISTRATEUR') && (
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paiementsFiltres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={hasRole('ADMINISTRATEUR') ? 7 : 6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          {recherche || filtreModePaiement !== 'TOUS' || filtrePatient
                            ? 'Aucun paiement ne correspond à votre recherche'
                            : 'Aucun paiement trouvé'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paiementsFiltres.map((paiement) => (
                      <TableRow 
                        key={paiement.id} 
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      >
                        <TableCell>
                          #{paiement.facture?.numeroFacture || `FAC-${paiement.factureId}`}
                        </TableCell>
                        <TableCell>
                          {paiement.facture?.patient?.prenom || '-'} {paiement.facture?.patient?.nom || '-'}
                        </TableCell>
                        <TableCell>{formaterDate(paiement.datePaiement)}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {paiement.montant?.toLocaleString('fr-FR') || '0'} MAD
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getLibelleModePaiement(paiement.modePaiement)} 
                            color={getCouleurModePaiement(paiement.modePaiement)}
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {paiement.referenceTransaction || '-'}
                        </TableCell>
                        {hasRole('ADMINISTRATEUR') && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleOuvrirDialogueSuppression(paiement.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      {}
      <Dialog
        open={dialogueSuppressionOuvert}
        onClose={handleFermerDialogueSuppression}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFermerDialogueSuppression}>Annuler</Button>
          <Button 
            onClick={handleConfirmerSuppression} 
            color="error" 
            variant="contained"
            disabled={mutationSuppression.isLoading}
          >
            {mutationSuppression.isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ListePaiements;

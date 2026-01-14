import React, { useState } from 'react';
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
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { rendezvousService } from '../../api/rendezvous';
import { patientsService } from '../../api/patients';
import { utilisateursService } from '../../api/utilisateurs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
const ListeRendezVous = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const { data, isLoading, error } = useQuery(
    'rendezvous',
    () => {
      if (hasRole('MEDECIN') && user?.id) {
        return rendezvousService.getByMedecin(user.id).catch(() => ({ data: [] }));
      }
      return rendezvousService.getAll().catch(() => ({ data: [] }));
    }
  );
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const { data: medecinsData } = useQuery('medecins', utilisateursService.getAllDoctors);
  const mutationStatut = useMutation(
    ({ id, statut }) => rendezvousService.changeStatus(id, statut),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rendezvous');
        showSuccess('Statut du rendez-vous modifié avec succès');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la modification du statut');
      },
    }
  );
  const mutationDelete = useMutation(
    (id) => rendezvousService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rendezvous');
        showSuccess('Rendez-vous supprimé avec succès');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la suppression du rendez-vous');
      },
    }
  );
  const rendezvous = data?.data || [];
  const patients = patientsData?.data || [];
  const medecins = medecinsData?.data || [];
  if (rendezvous.length > 0) {
    console.log('Premier rendez-vous:', rendezvous[0]);
  }
  const rendezvousEnrichis = rendezvous.map((rdv) => {
    let enrichedRdv = { ...rdv };
    if (!rdv.patient || typeof rdv.patient !== 'object') {
      const patient = patients.find(p => p.id === rdv.patientId);
      if (patient) {
        enrichedRdv.patient = patient;
      }
    }
    if (!rdv.medecin || typeof rdv.medecin !== 'object') {
      const medecin = medecins.find(m => m.id === rdv.medecinId);
      if (medecin) {
        enrichedRdv.medecin = medecin;
      }
    }
    return enrichedRdv;
  });
  const rendezvousFiltres = rendezvousEnrichis.filter((rdv) => {
    const correspondRecherche =
      recherche === '' ||
      `${rdv.patient?.nom} ${rdv.patient?.prenom}`.toLowerCase().includes(recherche.toLowerCase()) ||
      rdv.motif?.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut = filtreStatut === 'TOUS' || rdv.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  const getCouleurStatut = (statut) => {
    const couleurs = {
      PLANIFIE: 'default',
      CONFIRME: 'success',
      ANNULE: 'error',
      TERMINE: 'info',
      ABSENT: 'warning',
    };
    return couleurs[statut] || 'default';
  };
  const handleChangerStatut = (id, nouveauStatut) => {
    mutationStatut.mutate({ id, statut: nouveauStatut });
  };
  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      mutationDelete.mutate(id);
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des rendez-vous</Typography>
        {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/rendezvous/nouveau')}
          >
            Nouveau rendez-vous
          </Button>
        )}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un rendez-vous..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filtreStatut}
                label="Statut"
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <MenuItem value="TOUS">Tous</MenuItem>
                <MenuItem value="PLANIFIE">Planifié</MenuItem>
                <MenuItem value="CONFIRME">Confirmé</MenuItem>
                <MenuItem value="ANNULE">Annulé</MenuItem>
                <MenuItem value="TERMINE">Terminé</MenuItem>
                <MenuItem value="ABSENT">Absent</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors du chargement des rendez-vous
            </Alert>
          )}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Médecin</TableCell>
                    <TableCell>Date et heure</TableCell>
                    <TableCell>Motif</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rendezvousFiltres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun rendez-vous trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rendezvousFiltres.map((rendezvousItem) => (
                      <TableRow key={rendezvousItem.id} hover>
                        <TableCell>
                          {rendezvousItem.patient?.prenom} {rendezvousItem.patient?.nom}
                        </TableCell>
                        <TableCell>
                          {rendezvousItem.medecin?.prenom} {rendezvousItem.medecin?.nom}
                        </TableCell>
                        <TableCell>{formaterDate(rendezvousItem.dateHeure)}</TableCell>
                        <TableCell>{rendezvousItem.motif}</TableCell>
                        <TableCell>
                          <Chip
                            label={rendezvousItem.statut}
                            color={getCouleurStatut(rendezvousItem.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/patients/${rendezvousItem.patient?.id}`)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/rendezvous/${rendezvousItem.id}/modifier`)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL')) && (
                            <IconButton
                              size="small"
                              onClick={() => handleSupprimer(rendezvousItem.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                          {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
                            <FormControl size="small" sx={{ minWidth: 120, ml: 1 }}>
                              <Select
                                value={rendezvousItem.statut}
                                onChange={(e) => handleChangerStatut(rendezvousItem.id, e.target.value)}
                                sx={{ height: 32 }}
                              >
                                <MenuItem value="PLANIFIE">Planifié</MenuItem>
                                <MenuItem value="CONFIRME">Confirmé</MenuItem>
                                <MenuItem value="ANNULE">Annulé</MenuItem>
                                <MenuItem value="TERMINE">Terminé</MenuItem>
                                <MenuItem value="ABSENT">Absent</MenuItem>
                              </Select>
                            </FormControl>
                          )}
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
export default ListeRendezVous;

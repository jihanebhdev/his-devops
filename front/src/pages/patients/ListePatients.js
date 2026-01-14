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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { patientsService } from '../../api/patients';
import { useToast } from '../../hooks/useToast';
const ListePatients = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [recherche, setRecherche] = useState('');
  const [patientASupprimer, setPatientASupprimer] = useState(null);
  const [dialogueSuppression, setDialogueSuppression] = useState(false);
  const { data, isLoading, error } = useQuery('patients', patientsService.getAll);
  const { data: resultatsRecherche, isLoading: rechercheLoading } = useQuery(
    ['recherchePatients', recherche],
    () => patientsService.search(recherche),
    {
      enabled: recherche.length > 0,
    }
  );
  const mutationSuppression = useMutation(patientsService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('patients');
      showSuccess('Patient supprimé avec succès');
      setDialogueSuppression(false);
      setPatientASupprimer(null);
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Erreur lors de la suppression du patient');
    },
  });
  const patients = recherche.length > 0 ? resultatsRecherche?.data || [] : data?.data || [];
  const enChargement = isLoading || (recherche.length > 0 && rechercheLoading);
  const handleSupprimer = (patient) => {
    setPatientASupprimer(patient);
    setDialogueSuppression(true);
  };
  const confirmerSuppression = () => {
    if (patientASupprimer) {
      mutationSuppression.mutate(patientASupprimer.id);
    }
  };
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Liste des patients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/nouveau')}
        >
          Nouveau patient
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un patient..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors du chargement des patients
            </Alert>
          )}
          {enChargement ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Date de naissance</TableCell>
                    <TableCell>Sexe</TableCell>
                    <TableCell>Numéro d'identification</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun patient trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.id} hover>
                        <TableCell>{patient.nom}</TableCell>
                        <TableCell>{patient.prenom}</TableCell>
                        <TableCell>{formaterDate(patient.dateNaissance)}</TableCell>
                        <TableCell>{patient.sexe}</TableCell>
                        <TableCell>{patient.numeroIdentification}</TableCell>
                        <TableCell>{patient.telephone}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/patients/${patient.id}/modifier`)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSupprimer(patient)}
                            color="error"
                          >
                            <DeleteIcon />
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
      <Dialog open={dialogueSuppression} onClose={() => setDialogueSuppression(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le patient{' '}
            {patientASupprimer && `${patientASupprimer.prenom} ${patientASupprimer.nom}`} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogueSuppression(false)}>Annuler</Button>
          <Button onClick={confirmerSuppression} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ListePatients;

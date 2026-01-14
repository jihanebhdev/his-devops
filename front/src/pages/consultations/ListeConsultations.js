import React, { useState } from 'react';
import { useQuery } from 'react-query';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { consultationsService } from '../../api/consultations';
import { patientsService } from '../../api/patients';
import { utilisateursService } from '../../api/utilisateurs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useMutation, useQueryClient } from 'react-query';
const ListeConsultations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const [recherche, setRecherche] = useState('');
  const { data, isLoading } = useQuery('consultations', () => {
    if (hasRole('MEDECIN') && user?.id) {
      return consultationsService.getByMedecin(user.id).catch(() => ({ data: [] }));
    }
    if (hasRole('PATIENT')) {
      return consultationsService.getMyConsultations().catch(() => ({ data: [] }));
    }
    if (hasRole('ADMINISTRATEUR')) {
      return consultationsService.getAll().catch(() => ({ data: [] }));
    }
    return consultationsService.getAll().catch(() => ({ data: [] }));
  });
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const { data: medecinsData } = useQuery('medecins', utilisateursService.getAllDoctors);
  const consultations = Array.isArray(data?.data) 
    ? data.data 
    : Array.isArray(data) 
    ? data 
    : [];
  const patients = Array.isArray(patientsData?.data) 
    ? patientsData.data 
    : Array.isArray(patientsData) 
    ? patientsData 
    : [];
  const medecins = Array.isArray(medecinsData?.data) 
    ? medecinsData.data 
    : Array.isArray(medecinsData) 
    ? medecinsData 
    : [];
  const consultationsEnrichies = consultations.map((consultation) => {
    let enriched = { ...consultation };
    if (!consultation.patient || typeof consultation.patient !== 'object') {
      const patient = patients.find(p => p.id === consultation.patientId);
      if (patient) enriched.patient = patient;
    }
    if (!consultation.medecin || typeof consultation.medecin !== 'object') {
      const medecin = medecins.find(m => m.id === consultation.medecinId);
      if (medecin) enriched.medecin = medecin;
    }
    return enriched;
  });
  const mutationDelete = useMutation(
    (id) => consultationsService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('consultations');
        showSuccess('Consultation supprimée avec succès');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la suppression de la consultation');
      },
    }
  );
  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      mutationDelete.mutate(id);
    }
  };
  const consultationsFiltrees = consultationsEnrichies.filter((consultation) => {
    return (
      recherche === '' ||
      `${consultation.patient?.nom} ${consultation.patient?.prenom}`
        .toLowerCase()
        .includes(recherche.toLowerCase()) ||
      consultation.diagnostic?.toLowerCase().includes(recherche.toLowerCase())
    );
  });
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des consultations</Typography>
        {(hasRole('ADMINISTRATEUR') || hasRole('MEDECIN')) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/consultations/nouvelle')}
          >
            Nouvelle consultation
          </Button>
        )}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher une consultation..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
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
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Diagnostic</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultationsFiltrees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucune consultation trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    consultationsFiltrees.map((consultation) => (
                      <TableRow key={consultation.id} hover>
                        <TableCell>
                          {consultation.patient?.prenom} {consultation.patient?.nom}
                        </TableCell>
                        <TableCell>
                          {consultation.medecin?.prenom} {consultation.medecin?.nom}
                        </TableCell>
                        <TableCell>{formaterDate(consultation.dateHeure)}</TableCell>
                        <TableCell>
                          <Chip label={consultation.typeConsultation || 'Générale'} size="small" />
                        </TableCell>
                        <TableCell>{consultation.diagnostic || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/patients/${consultation.patient?.id}`)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {(hasRole('ADMINISTRATEUR') || hasRole('MEDECIN')) && (
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/consultations/${consultation.id}/modifier`)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {hasRole('ADMINISTRATEUR') && (
                            <IconButton
                              size="small"
                              onClick={() => handleSupprimer(consultation.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
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
export default ListeConsultations;

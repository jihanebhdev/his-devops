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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { patientsService } from '../../api/patients';
import { dossiersService } from '../../api/dossiers';
import { useAuth } from '../../contexts/AuthContext';
const ListeDossiersMedicaux = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [recherche, setRecherche] = useState('');
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const patients = patientsData?.data || [];
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const patientsAvecDossier = patients.filter((patient) => recherche === '' || 
    `${patient.nom} ${patient.prenom}`.toLowerCase().includes(recherche.toLowerCase())
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des dossiers médicaux</Typography>
        {(hasRole('ADMINISTRATEUR') || hasRole('AGENT_ACCUEIL') || hasRole('MEDECIN')) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dossiers/nouveau')}
          >
            Nouveau dossier
          </Button>
        )}
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Numéro d'identification</TableCell>
                  <TableCell>Date de naissance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientsAvecDossier.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary">
                        Aucun patient trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  patientsAvecDossier.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        {patient.prenom} {patient.nom}
                      </TableCell>
                      <TableCell>{patient.numeroIdentification}</TableCell>
                      <TableCell>{formaterDate(patient.dateNaissance)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/dossiers/patient/${patient.id}`)}
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
        </CardContent>
      </Card>
    </Box>
  );
};
export default ListeDossiersMedicaux;

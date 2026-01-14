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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { assurancesService } from '../../api/assurances';
import { useAuth } from '../../contexts/AuthContext';
import { patientsService } from '../../api/patients';
const ListeAssurances = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [recherche, setRecherche] = useState('');
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile, {
    enabled: hasRole('PATIENT'),
  });
  const patientId = hasRole('PATIENT') ? profile?.data?.id : null;
  const { data, isLoading } = useQuery(
    ['assurances', patientId],
    () => {
      if (hasRole('PATIENT') && patientId) {
        return assurancesService.getByPatient(patientId);
      }
      return assurancesService.getAll();
    },
    { enabled: hasRole('PATIENT') ? !!patientId : true }
  );
  const assurances = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const assurancesFiltrees = assurances.filter((assurance) => {
    if (!recherche) return true;
    const rechercheMin = recherche.toLowerCase();
    return (
      assurance.nomAssurance?.toLowerCase().includes(rechercheMin) ||
      assurance.numeroContrat?.toLowerCase().includes(rechercheMin) ||
      `${assurance.patient?.prenom} ${assurance.patient?.nom}`.toLowerCase().includes(rechercheMin)
    );
  });
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des assurances</Typography>
        {(hasRole('ADMINISTRATEUR') || hasRole('COMPTABLE')) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/assurances/nouvelle')}
          >
            Nouvelle assurance
          </Button>
        )}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher une assurance..."
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
                    <TableCell>Nom de l'assurance</TableCell>
                    <TableCell>Numéro de contrat</TableCell>
                    <TableCell>Taux de couverture</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assurancesFiltrees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          {recherche ? 'Aucune assurance ne correspond à votre recherche' : 'Aucune assurance trouvée'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assurancesFiltrees.map((assurance) => (
                      <TableRow key={assurance.id} hover>
                        <TableCell>
                          {assurance.patient?.prenom || '-'} {assurance.patient?.nom || '-'}
                        </TableCell>
                        <TableCell>{assurance.nomAssurance || '-'}</TableCell>
                        <TableCell>{assurance.numeroContrat || '-'}</TableCell>
                        <TableCell>{assurance.tauxCouverture ? `${assurance.tauxCouverture}%` : '-'}</TableCell>
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
export default ListeAssurances;

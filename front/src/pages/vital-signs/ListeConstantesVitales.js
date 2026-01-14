import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
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
import { constantesService } from '../../api/constantes';
import { useAuth } from '../../contexts/AuthContext';
const ListeConstantesVitales = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { patientId } = useParams();
  const [recherche, setRecherche] = useState('');
  const { data, isLoading } = useQuery(
    ['constantes', patientId],
    () => {
      if (patientId) {
        return constantesService.getByPatient(patientId);
      }
      if (hasRole('ADMINISTRATEUR') || hasRole('INFIRMIER') || hasRole('MEDECIN')) {
        return constantesService.getAll().catch(() => ({ data: [] }));
      }
      return { data: [] };
    }
  );
  const constantes = data?.data || [];
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  const constantesFiltrees = constantes.filter((constante) => {
    if (!recherche) return true;
    const rechercheMin = recherche.toLowerCase();
    const patientNom = `${constante.patient?.prenom || ''} ${constante.patient?.nom || ''}`.toLowerCase();
    return patientNom.includes(rechercheMin);
  });
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Constantes vitales</Typography>
        {(hasRole('ADMINISTRATEUR') || hasRole('INFIRMIER') || hasRole('MEDECIN')) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/constantes-vitales/nouvelle')}
          >
            Enregistrer constantes
          </Button>
        )}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
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
                    <TableCell>Date</TableCell>
                    <TableCell>Température (°C)</TableCell>
                    <TableCell>Tension (mmHg)</TableCell>
                    <TableCell>Pouls (bpm)</TableCell>
                    <TableCell>Poids (kg)</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {constantesFiltrees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="textSecondary">
                          {constantes.length === 0 ? 'Aucune constante enregistrée' : 'Aucun résultat trouvé'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    constantesFiltrees.map((constante) => (
                      <TableRow 
                        key={constante.id} 
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/patients/${constante.patient?.id}`)}
                      >
                        <TableCell>
                          {constante.patient?.prenom} {constante.patient?.nom}
                        </TableCell>
                        <TableCell>{formaterDate(constante.dateHeure)}</TableCell>
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
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/patients/${constante.patient?.id}`)}
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
export default ListeConstantesVitales;

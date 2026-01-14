import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { patientsService } from '../../api/patients';
import { facturesService } from '../../api/factures';
const MesFactures = () => {
  const navigate = useNavigate();
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile);
  const patientId = profile?.data?.id;
  const { data, isLoading } = useQuery(
    ['factures', patientId],
    () => facturesService.getByPatient(patientId),
    { enabled: !!patientId }
  );
  const factures = data?.data || [];
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const getCouleurStatut = (statut) => {
    const couleurs = {
      PAYE: 'success',
      EN_ATTENTE: 'warning',
      IMPAYE: 'error',
    };
    return couleurs[statut] || 'default';
  };
  const montantTotal = factures.reduce((sum, f) => sum + (f.montantTotal || 0), 0);
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mes factures
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Total des factures</Typography>
            <Typography variant="h4" color="primary.main">
              {montantTotal.toLocaleString('fr-FR')} MAD
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numéro</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {factures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucune facture trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    factures.map((facture) => (
                      <TableRow key={facture.id} hover>
                        <TableCell>#{facture.numeroFacture || facture.id}</TableCell>
                        <TableCell>{formaterDate(facture.dateFacturation)}</TableCell>
                        <TableCell>{facture.montantTotal?.toLocaleString('fr-FR')} MAD</TableCell>
                        <TableCell>
                          <Chip
                            label={facture.statut || 'EN_ATTENTE'}
                            color={getCouleurStatut(facture.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/bills/${facture.id}`)}
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
export default MesFactures;

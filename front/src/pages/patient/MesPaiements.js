import React from 'react';
import { useQuery } from 'react-query';
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
  Chip,
} from '@mui/material';
import { patientsService } from '../../api/patients';
import { paiementsService } from '../../api/paiements';
const MesPaiements = () => {
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile);
  const patientId = profile?.data?.id;
  const { data, isLoading } = useQuery(
    ['paiements', patientId],
    () => paiementsService.getByPatient(patientId),
    { enabled: !!patientId }
  );
  const paiements = data?.data || [];
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const montantTotal = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mes paiements
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Total payé</Typography>
            <Typography variant="h4" color="success.main">
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
                    <TableCell>Facture</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Mode de paiement</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paiements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun paiement trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paiements.map((paiement) => (
                      <TableRow key={paiement.id} hover>
                        <TableCell>
                          #{paiement.facture?.numeroFacture || paiement.factureId}
                        </TableCell>
                        <TableCell>{formaterDate(paiement.datePaiement)}</TableCell>
                        <TableCell>{paiement.montant?.toLocaleString('fr-FR')} MAD</TableCell>
                        <TableCell>
                          <Chip label={paiement.modePaiement} size="small" />
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
export default MesPaiements;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Print as PrintIcon } from '@mui/icons-material';
import { facturesService } from '../../api/factures';
import { paiementsService } from '../../api/paiements';
import { patientsService } from '../../api/patients';
const DetailsFacture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(['facture', id], () => facturesService.getById(id));
  const { data: paiements } = useQuery(
    ['paiements', id],
    () => paiementsService.getByFacture(id),
    { enabled: !!id }
  );
  const patientId = data?.data?.patientId || data?.data?.patient?.id;
  const { data: patientData } = useQuery(
    ['patient', patientId],
    () => patientsService.getById(patientId),
    { enabled: !!patientId && !data?.data?.patient }
  );
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const facture = data?.data;
  const patient = facture?.patient || patientData?.data || patientData;
  if (!facture) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Facture non trouvée
        </Typography>
      </Box>
    );
  }
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const montantPaye = paiements?.data?.reduce((sum, p) => sum + (p.montant || 0), 0) || 0;
  const soldeRestant = (facture.montantTotal || 0) - montantPaye;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/factures')}>
            Retour
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Facture #{facture.numeroFacture || facture.id}
            </Typography>
            {patient && (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
                Patient: {patient.prenom} {patient.nom}
              </Typography>
            )}
          </Box>
        </Box>
        <Button startIcon={<PrintIcon />} variant="outlined">
          Imprimer
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Patient
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {patient?.prenom} {patient?.nom}
                    {patient?.numeroIdentification && ` (ID: ${patient.numeroIdentification})`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date de facturation
                  </Typography>
                  <Typography variant="body1">{formaterDate(facture.dateFacturation)}</Typography>
                </Grid>
                {facture.assurance && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Assurance
                    </Typography>
                    <Typography variant="body1">{facture.assurance.nomAssurance}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Statut
                  </Typography>
                  <Chip
                    label={facture.statut || 'EN_ATTENTE'}
                    color={soldeRestant === 0 ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Détails de la facture
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Prix unitaire</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facture.lignesFacture?.map((ligne, index) => (
                      <TableRow key={index}>
                        <TableCell>{ligne.description}</TableCell>
                        <TableCell align="right">{ligne.quantite}</TableCell>
                        <TableCell align="right">
                          {ligne.prixUnitaire?.toLocaleString('fr-FR')} MAD
                        </TableCell>
                        <TableCell align="right">
                          {(ligne.quantite * ligne.prixUnitaire).toLocaleString('fr-FR')} MAD
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {facture.montantTotal?.toLocaleString('fr-FR')} MAD
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {paiements?.data && paiements.data.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                    Paiements
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Montant</TableCell>
                          <TableCell>Mode de paiement</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paiements.data.map((paiement) => (
                          <TableRow key={paiement.id}>
                            <TableCell>{formaterDate(paiement.datePaiement)}</TableCell>
                            <TableCell>{paiement.montant?.toLocaleString('fr-FR')} MAD</TableCell>
                            <TableCell>{paiement.modePaiement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Résumé
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Montant total
                </Typography>
                <Typography variant="h6">
                  {facture.montantTotal?.toLocaleString('fr-FR')} MAD
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Montant payé
                </Typography>
                <Typography variant="h6" color="success.main">
                  {montantPaye.toLocaleString('fr-FR')} MAD
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DetailsFacture;

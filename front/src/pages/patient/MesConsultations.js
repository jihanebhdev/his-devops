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
import { consultationsService } from '../../api/consultations';
const MesConsultations = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery('myConsultations', consultationsService.getMyConsultations);
  const consultations = data?.data || [];
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mes consultations
      </Typography>
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
                    <TableCell>Date</TableCell>
                    <TableCell>Médecin</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Diagnostic</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucune consultation trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    consultations.map((consultation) => (
                      <TableRow key={consultation.id} hover>
                        <TableCell>{formaterDate(consultation.dateHeure)}</TableCell>
                        <TableCell>
                          {consultation.medecin?.prenom} {consultation.medecin?.nom}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={consultation.typeConsultation || 'Générale'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{consultation.diagnostic || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/consultations/${consultation.id}`)}
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
export default MesConsultations;

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
import { hospitalisationsService } from '../../api/hospitalisations';
const MesHospitalisations = () => {
  const navigate = useNavigate();
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile);
  const patientId = profile?.data?.id;
  const { data, isLoading } = useQuery(
    ['hospitalisations', patientId],
    () => hospitalisationsService.getByPatient(patientId),
    { enabled: !!patientId }
  );
  const hospitalisations = data?.data || [];
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mes hospitalisations
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
                    <TableCell>Date d'admission</TableCell>
                    <TableCell>Date de sortie</TableCell>
                    <TableCell>Lit</TableCell>
                    <TableCell>Motif</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hospitalisations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucune hospitalisation trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    hospitalisations.map((hospitalisation) => (
                      <TableRow key={hospitalisation.id} hover>
                        <TableCell>{formaterDate(hospitalisation.dateAdmission)}</TableCell>
                        <TableCell>{formaterDate(hospitalisation.dateSortie)}</TableCell>
                        <TableCell>
                          {hospitalisation.lit?.numeroLit || '-'} - {hospitalisation.lit?.service || '-'}
                        </TableCell>
                        <TableCell>{hospitalisation.motifAdmission}</TableCell>
                        <TableCell>
                          <Chip
                            label={hospitalisation.statut}
                            color={hospitalisation.statut === 'EN_COURS' ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/hospitalisations/${hospitalisation.id}`)}
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
export default MesHospitalisations;

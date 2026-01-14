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
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { patientsService } from '../../api/patients';
import { constantesService } from '../../api/constantes';
const MesConstantesVitales = () => {
  const { data: profile } = useQuery('myProfile', patientsService.getMyProfile);
  const patientId = profile?.data?.id;
  const { data, isLoading } = useQuery(
    ['constantes', patientId],
    () => constantesService.getByPatient(patientId),
    { enabled: !!patientId }
  );
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const constantes = data?.data || [];
  const donneesGraphique = constantes
    .slice(-10)
    .map((constante) => ({
      date: new Date(constante.dateHeure).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      }),
      temperature: constante.temperature,
      tension: constante.tensionArterielleSystolique,
      pouls: constante.frequenceCardiaque,
    }))
    .reverse();
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mes constantes vitales
      </Typography>
      {constantes.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Évolution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donneesGraphique}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#d32f2f"
                  strokeWidth={2}
                  name="Température (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tension"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Tension (mmHg)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pouls"
                  stroke="#2e7d32"
                  strokeWidth={2}
                  name="Pouls (bpm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Historique
          </Typography>
          {constantes.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
              Aucune constante enregistrée
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Température (°C)</TableCell>
                    <TableCell>Tension (mmHg)</TableCell>
                    <TableCell>Pouls (bpm)</TableCell>
                    <TableCell>Poids (kg)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {constantes.map((constante) => (
                    <TableRow key={constante.id} hover>
                      <TableCell>{formaterDate(constante.dateHeure)}</TableCell>
                      <TableCell>{constante.temperature || '-'}</TableCell>
                      <TableCell>
                        {constante.tensionArterielleSystolique && constante.tensionArterielleDiastolique
                          ? `${constante.tensionArterielleSystolique}/${constante.tensionArterielleDiastolique}`
                          : '-'}
                      </TableCell>
                      <TableCell>{constante.frequenceCardiaque || '-'}</TableCell>
                      <TableCell>{constante.poids || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default MesConstantesVitales;

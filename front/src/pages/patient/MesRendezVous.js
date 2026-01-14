import React, { useState } from 'react';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { rendezvousService } from '../../api/rendezvous';
const MesRendezVous = () => {
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const { data, isLoading } = useQuery('myAppointments', rendezvousService.getMyAppointments);
  const rendezvous = data?.data || [];
  const rendezvousFiltres = rendezvous.filter((rdv) => {
    return filtreStatut === 'TOUS' || rdv.statut === filtreStatut;
  });
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };
  const getCouleurStatut = (statut) => {
    const couleurs = {
      PLANIFIE: 'default',
      CONFIRME: 'success',
      ANNULE: 'error',
      TERMINE: 'info',
      ABSENT: 'warning',
    };
    return couleurs[statut] || 'default';
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Mes rendez-vous</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filtreStatut}
            label="Statut"
            onChange={(e) => setFiltreStatut(e.target.value)}
          >
            <MenuItem value="TOUS">Tous</MenuItem>
            <MenuItem value="PLANIFIE">Planifié</MenuItem>
            <MenuItem value="CONFIRME">Confirmé</MenuItem>
            <MenuItem value="ANNULE">Annulé</MenuItem>
            <MenuItem value="TERMINE">Terminé</MenuItem>
          </Select>
        </FormControl>
      </Box>
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
                    <TableCell>Date et heure</TableCell>
                    <TableCell>Médecin</TableCell>
                    <TableCell>Motif</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rendezvousFiltres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun rendez-vous trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rendezvousFiltres.map((rendezvousItem) => (
                      <TableRow key={rendezvousItem.id} hover>
                        <TableCell>{formaterDate(rendezvousItem.dateHeure)}</TableCell>
                        <TableCell>
                          {rendezvousItem.medecin?.prenom} {rendezvousItem.medecin?.nom}
                        </TableCell>
                        <TableCell>{rendezvousItem.motif}</TableCell>
                        <TableCell>
                          <Chip
                            label={rendezvousItem.statut}
                            color={getCouleurStatut(rendezvousItem.statut)}
                            size="small"
                          />
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
export default MesRendezVous;

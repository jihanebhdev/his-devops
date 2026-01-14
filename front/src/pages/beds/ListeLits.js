import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { litsService } from '../../api/lits';
const ListeLits = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const { data, isLoading } = useQuery('lits', litsService.getAll);
  const lits = data?.data || [];
  const litsFiltres = lits.filter((lit) => {
    const correspondRecherche =
      recherche === '' ||
      lit.numeroLit?.toLowerCase().includes(recherche.toLowerCase()) ||
      lit.service?.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut = filtreStatut === 'TOUS' || lit.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });
  const getCouleurStatut = (statut) => {
    const couleurs = {
      DISPONIBLE: 'success',
      OCCUPE: 'error',
      MAINTENANCE: 'warning',
      RESERVE: 'info',
    };
    return couleurs[statut] || 'default';
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des lits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/lits/nouveau')}
        >
          Nouveau lit
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un lit..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filtreStatut}
                label="Statut"
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <MenuItem value="TOUS">Tous</MenuItem>
                <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                <MenuItem value="OCCUPE">Occupé</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="RESERVE">Réservé</MenuItem>
              </Select>
            </FormControl>
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
                    <TableCell>Numéro</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Chambre</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {litsFiltres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun lit trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    litsFiltres.map((lit) => (
                      <TableRow key={lit.id} hover>
                        <TableCell>{lit.numeroLit}</TableCell>
                        <TableCell>{lit.service}</TableCell>
                        <TableCell>{lit.chambre}</TableCell>
                        <TableCell>
                          <Chip
                            label={lit.statut}
                            color={getCouleurStatut(lit.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{lit.notes || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/lits/${lit.id}/modifier`)}
                            color="primary"
                          >
                            <EditIcon />
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
export default ListeLits;

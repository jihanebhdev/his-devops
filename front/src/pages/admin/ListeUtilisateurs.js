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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { utilisateursService } from '../../api/utilisateurs';
import { useToast } from '../../hooks/useToast';
const ListeUtilisateurs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [recherche, setRecherche] = useState('');
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
  const [dialogueSuppression, setDialogueSuppression] = useState(false);
  const { data, isLoading, error } = useQuery('utilisateurs', utilisateursService.getAll);
  const mutationSuppression = useMutation(utilisateursService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('utilisateurs');
      showSuccess('Utilisateur supprimé avec succès');
      setDialogueSuppression(false);
      setUtilisateurASupprimer(null);
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    },
  });
  const utilisateurs = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  const utilisateursFiltres = utilisateurs.filter((user) => {
    const searchText = `${user.nom || ''} ${user.prenom || ''} ${user.username || ''} ${user.email || ''}`.toLowerCase();
    return recherche === '' || searchText.includes(recherche.toLowerCase());
  });
  const handleSupprimer = (user) => {
    setUtilisateurASupprimer(user);
    setDialogueSuppression(true);
  };
  const confirmerSuppression = () => {
    if (utilisateurASupprimer) {
      mutationSuppression.mutate(utilisateurASupprimer.id);
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des utilisateurs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/utilisateurs/nouveau')}
        >
          Nouvel utilisateur
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un utilisateur..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.response?.data?.message || error?.message || 'Erreur lors du chargement des utilisateurs'}
            </Alert>
          )}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom d'utilisateur</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Rôles</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {utilisateursFiltres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun utilisateur trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    utilisateursFiltres.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.nom}</TableCell>
                        <TableCell>{user.prenom}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telephone}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                              user.roles.map((role) => {
                                const roleName = typeof role === 'object' ? role.nom : role;
                                const roleId = typeof role === 'object' ? role.id : role;
                                return (
                                  <Chip
                                    key={roleId}
                                    label={roleName}
                                    size="small"
                                    variant="outlined"
                                  />
                                );
                              })
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                Aucun rôle
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.actif ? 'Actif' : 'Inactif'}
                            color={user.actif ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/admin/utilisateurs/${user.id}/modifier`)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSupprimer(user)}
                            color="error"
                          >
                            <DeleteIcon />
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
      <Dialog open={dialogueSuppression} onClose={() => setDialogueSuppression(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            {utilisateurASupprimer && utilisateurASupprimer.username} ? Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogueSuppression(false)}>Annuler</Button>
          <Button onClick={confirmerSuppression} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ListeUtilisateurs;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { permissionsService } from '../../api/permissions';
import { useToast } from '../../hooks/useToast';
const ListePermissions = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [dialogueAjout, setDialogueAjout] = useState(false);
  const [dialogueEdition, setDialogueEdition] = useState(false);
  const [dialogueSuppression, setDialogueSuppression] = useState(false);
  const [permissionASupprimer, setPermissionASupprimer] = useState(null);
  const [permissionAEditer, setPermissionAEditer] = useState(null);
  const [nouvellePermission, setNouvellePermission] = useState({ nom: '', description: '' });
  const { data, isLoading, error } = useQuery('permissions', permissionsService.getAll);
  const mutationCreation = useMutation(
    (data) => permissionsService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('permissions');
        showSuccess('Permission créée avec succès');
        setDialogueAjout(false);
        setNouvellePermission({ nom: '', description: '' });
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la création de la permission');
      },
    }
  );
  const mutationEdition = useMutation(
    (data) => permissionsService.update(permissionAEditer.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('permissions');
        showSuccess('Permission modifiée avec succès');
        setDialogueEdition(false);
        setPermissionAEditer(null);
        setNouvellePermission({ nom: '', description: '' });
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la modification de la permission');
      },
    }
  );
  const mutationSuppression = useMutation(permissionsService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('permissions');
      showSuccess('Permission supprimée avec succès');
      setDialogueSuppression(false);
      setPermissionASupprimer(null);
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Erreur lors de la suppression de la permission');
    },
  });
  const permissions = data?.data || data || [];
  useEffect(() => {
    if (permissionAEditer) {
      setNouvellePermission({
        nom: permissionAEditer.nom || '',
        description: permissionAEditer.description || '',
      });
    }
  }, [permissionAEditer]);
  const handleAjouter = () => {
    if (!nouvellePermission.nom.trim()) {
      showError('Le nom de la permission est requis');
      return;
    }
    mutationCreation.mutate(nouvellePermission);
  };
  const handleEditer = (permission) => {
    setPermissionAEditer(permission);
    setDialogueEdition(true);
  };
  const handleModifier = () => {
    if (!nouvellePermission.nom.trim()) {
      showError('Le nom de la permission est requis');
      return;
    }
    mutationEdition.mutate(nouvellePermission);
  };
  const handleSupprimer = (permission) => {
    setPermissionASupprimer(permission);
    setDialogueSuppression(true);
  };
  const confirmerSuppression = () => {
    if (permissionASupprimer) {
      mutationSuppression.mutate(permissionASupprimer.id);
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des permissions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogueAjout(true)}
        >
          Nouvelle permission
        </Button>
      </Box>
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors du chargement des permissions: {error.message}
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
                    <TableCell>Nom</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucune permission trouvée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    permissions.map((permission) => (
                      <TableRow key={permission.id} hover>
                        <TableCell>{permission.nom}</TableCell>
                        <TableCell>{permission.description || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditer(permission)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSupprimer(permission)}
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
      {}
      <Dialog open={dialogueAjout} onClose={() => setDialogueAjout(false)}>
        <DialogTitle>Nouvelle permission</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom"
            value={nouvellePermission.nom}
            onChange={(e) => setNouvellePermission({ ...nouvellePermission, nom: e.target.value })}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={nouvellePermission.description}
            onChange={(e) =>
              setNouvellePermission({ ...nouvellePermission, description: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogueAjout(false);
            setNouvellePermission({ nom: '', description: '' });
          }}>
            Annuler
          </Button>
          <Button onClick={handleAjouter} variant="contained" disabled={mutationCreation.isLoading}>
            {mutationCreation.isLoading ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Dialog open={dialogueEdition} onClose={() => {
        setDialogueEdition(false);
        setPermissionAEditer(null);
        setNouvellePermission({ nom: '', description: '' });
      }}>
        <DialogTitle>Modifier la permission</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom"
            value={nouvellePermission.nom}
            onChange={(e) => setNouvellePermission({ ...nouvellePermission, nom: e.target.value })}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={nouvellePermission.description}
            onChange={(e) =>
              setNouvellePermission({ ...nouvellePermission, description: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogueEdition(false);
            setPermissionAEditer(null);
            setNouvellePermission({ nom: '', description: '' });
          }}>
            Annuler
          </Button>
          <Button onClick={handleModifier} variant="contained" disabled={mutationEdition.isLoading}>
            {mutationEdition.isLoading ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Dialog open={dialogueSuppression} onClose={() => setDialogueSuppression(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la permission{' '}
            <strong>{permissionASupprimer?.nom}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogueSuppression(false)}>Annuler</Button>
          <Button
            onClick={confirmerSuppression}
            color="error"
            variant="contained"
            disabled={mutationSuppression.isLoading}
          >
            {mutationSuppression.isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ListePermissions;

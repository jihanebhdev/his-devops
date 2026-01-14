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
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { rolesService } from '../../api/roles';
import { permissionsService } from '../../api/permissions';
import { useToast } from '../../hooks/useToast';
const ListeRoles = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [dialogueAjout, setDialogueAjout] = useState(false);
  const [dialogueEdition, setDialogueEdition] = useState(false);
  const [dialogueSuppression, setDialogueSuppression] = useState(false);
  const [roleASupprimer, setRoleASupprimer] = useState(null);
  const [roleAEditer, setRoleAEditer] = useState(null);
  const [nouveauRole, setNouveauRole] = useState({ nom: '', description: '', permissionIds: [] });
  const { data, isLoading, error } = useQuery('roles', rolesService.getAll);
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery('permissions', permissionsService.getAll);
  const permissions = permissionsData?.data || permissionsData || [];
  const mutationCreation = useMutation(
    (data) => rolesService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roles');
        showSuccess('Rôle créé avec succès');
        setDialogueAjout(false);
        setNouveauRole({ nom: '', description: '', permissionIds: [] });
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la création du rôle');
      },
    }
  );
  const mutationEdition = useMutation(
    (data) => rolesService.update(roleAEditer.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roles');
        showSuccess('Rôle modifié avec succès');
        setDialogueEdition(false);
        setRoleAEditer(null);
        setNouveauRole({ nom: '', description: '', permissionIds: [] });
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la modification du rôle');
      },
    }
  );
  const mutationSuppression = useMutation(rolesService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('roles');
      showSuccess('Rôle supprimé avec succès');
      setDialogueSuppression(false);
      setRoleASupprimer(null);
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Erreur lors de la suppression du rôle');
    },
  });
  const roles = data?.data || data || [];
  const [currentEditingRoleId, setCurrentEditingRoleId] = useState(null);
  useEffect(() => {
    if (!dialogueEdition) {
      console.log('Dialogue fermé, réinitialisation du formulaire');
      setNouveauRole({ nom: '', description: '', permissionIds: [] });
      setCurrentEditingRoleId(null);
      setRoleAEditer(null);
    }
  }, [dialogueEdition]);
  const handleAjouter = () => {
    if (!nouveauRole.nom.trim()) {
      showError('Le nom du rôle est requis');
      return;
    }
    const permissionIds = Array.isArray(nouveauRole.permissionIds)
      ? nouveauRole.permissionIds.map((id) => {
          const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
          return isNaN(numId) ? id : numId;
        }).filter(id => !isNaN(id))
      : [];
    const roleData = {
      nom: nouveauRole.nom.trim(),
      description: nouveauRole.description || '',
      permissionIds: permissionIds
    };
    mutationCreation.mutate(roleData);
  };
  const handleEditer = async (role) => {
    console.log('=== HANDLEEDITER APPELÉ ===');
    console.log('Role reçu:', role);
    try {
      const roleDetailsResponse = await rolesService.getById(role.id);
      const fullRole = roleDetailsResponse?.data || roleDetailsResponse || role;
      console.log('=== CHARGEMENT DU RÔLE ===');
      console.log('Rôle chargé pour édition:', fullRole);
      console.log('Permissions du rôle chargé:', fullRole.permissions);
      console.log('PermissionIds du rôle chargé:', fullRole.permissionIds);
      let permissionIds = [];
      if (fullRole.permissionIds && Array.isArray(fullRole.permissionIds)) {
        permissionIds = fullRole.permissionIds.map((id) => {
          return typeof id === 'string' ? parseInt(id, 10) : Number(id);
        }).filter(id => !isNaN(id));
      } 
      else if (fullRole.permissions && Array.isArray(fullRole.permissions)) {
        permissionIds = fullRole.permissions.map((perm) => {
          if (typeof perm === 'object' && perm !== null && perm.id) {
            const permId = perm.id;
            return typeof permId === 'string' ? parseInt(permId, 10) : Number(permId);
          } 
          else if (typeof perm === 'number') {
            return perm;
          }
          else if (typeof perm === 'string' && !isNaN(parseInt(perm, 10))) {
            return parseInt(perm, 10);
          }
          else if (typeof perm === 'string') {
            const foundPerm = permissions.find(p => p.nom === perm);
            if (foundPerm) {
              const permId = foundPerm.id;
              return typeof permId === 'string' ? parseInt(permId, 10) : Number(permId);
            }
            return null;
          }
          return null;
        }).filter(id => id !== null && !isNaN(id));
      }
      console.log('Permission IDs extraits dans handleEditer:', permissionIds);
      console.log('Permissions disponibles pour matching:', permissions);
      setNouveauRole({
        nom: fullRole.nom || '',
        description: fullRole.description || '',
        permissionIds: permissionIds,
      });
      setRoleAEditer(fullRole);
      setCurrentEditingRoleId(fullRole.id);
      setDialogueEdition(true);
    } catch (error) {
      console.error('Erreur lors du chargement des détails du rôle:', error);
      let permissionIds = [];
      if (role.permissionIds && Array.isArray(role.permissionIds)) {
        permissionIds = role.permissionIds.map((id) => {
          return typeof id === 'string' ? parseInt(id, 10) : Number(id);
        }).filter(id => !isNaN(id));
      } else if (role.permissions && Array.isArray(role.permissions)) {
        permissionIds = role.permissions.map((perm) => {
          if (typeof perm === 'object' && perm !== null && perm.id) {
            const permId = perm.id;
            return typeof permId === 'string' ? parseInt(permId, 10) : Number(permId);
          } else if (typeof perm === 'number') {
            return perm;
          } else if (typeof perm === 'string' && !isNaN(parseInt(perm, 10))) {
            return parseInt(perm, 10);
          } else if (typeof perm === 'string') {
            const foundPerm = permissions.find(p => p.nom === perm);
            if (foundPerm) {
              const permId = foundPerm.id;
              return typeof permId === 'string' ? parseInt(permId, 10) : Number(permId);
            }
            return null;
          }
          return null;
        }).filter(id => id !== null && !isNaN(id));
      }
      setNouveauRole({
        nom: role.nom || '',
        description: role.description || '',
        permissionIds: permissionIds,
      });
      setRoleAEditer(role);
      setCurrentEditingRoleId(role.id);
      setDialogueEdition(true);
    }
  };
  const handleModifier = () => {
    if (!nouveauRole.nom || !nouveauRole.nom.trim()) {
      showError('Le nom du rôle est requis');
      return;
    }
    const permissionIds = Array.isArray(nouveauRole.permissionIds)
      ? nouveauRole.permissionIds.map((id) => {
          const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
          return isNaN(numId) ? null : numId;
        }).filter(id => id !== null && !isNaN(id))
      : [];
    if (permissionIds.length === 0 && roleAEditer) {
      const hadPermissions = roleAEditer.permissions?.length > 0 || roleAEditer.permissionIds?.length > 0;
      if (hadPermissions) {
        showError('Attention: Aucune permission sélectionnée. Les permissions existantes seront supprimées.');
      }
    }
    console.log('Permissions à envoyer:', permissionIds);
    console.log('État actuel de nouveauRole:', nouveauRole);
    console.log('Rôle original:', roleAEditer);
    const roleData = {
      nom: nouveauRole.nom.trim(),
      description: nouveauRole.description || '',
      permissionIds: permissionIds
    };
    console.log('Données du rôle à envoyer:', roleData);
    mutationEdition.mutate(roleData);
  };
  const handleSupprimer = (role) => {
    setRoleASupprimer(role);
    setDialogueSuppression(true);
  };
  const confirmerSuppression = () => {
    if (roleASupprimer) {
      mutationSuppression.mutate(roleASupprimer.id);
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des rôles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogueAjout(true)}
        >
          Nouveau rôle
        </Button>
      </Box>
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors du chargement des rôles: {error.message}
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
                    <TableCell>Permissions</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Aucun rôle trouvé
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => {
                      const permissions = role.permissions || role.permissionIds || [];
                      const permissionsArray = Array.isArray(permissions) ? permissions : [];
                      return (
                        <TableRow key={role.id} hover>
                          <TableCell>
                            <Chip label={role.nom} variant="outlined" color="primary" />
                          </TableCell>
                          <TableCell>{role.description || '-'}</TableCell>
                          <TableCell>
                            {permissionsArray.length > 0 ? (
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {permissionsArray.slice(0, 3).map((perm, index) => {
                                  const permName = typeof perm === 'object' ? perm.nom : perm;
                                  const permId = typeof perm === 'object' ? perm.id : index;
                                  return (
                                    <Chip
                                      key={permId}
                                      label={permName}
                                      size="small"
                                      variant="outlined"
                                    />
                                  );
                                })}
                                {permissionsArray.length > 3 && (
                                  <Chip
                                    label={`+${permissionsArray.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Aucune permission
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditer(role)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleSupprimer(role)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      {}
      <Dialog open={dialogueAjout} onClose={() => {
        setDialogueAjout(false);
        setNouveauRole({ nom: '', description: '', permissionIds: [] });
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Nouveau rôle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom"
            value={nouveauRole.nom}
            onChange={(e) => setNouveauRole({ ...nouveauRole, nom: e.target.value })}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={nouveauRole.description}
            onChange={(e) => setNouveauRole({ ...nouveauRole, description: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="permissions-label">Permissions</InputLabel>
            <Select
              labelId="permissions-label"
              multiple
              value={(nouveauRole.permissionIds || [])
                .map(id => typeof id === 'string' ? parseInt(id, 10) : Number(id))
                .filter(id => !isNaN(id))}
              onChange={(e) => {
                const value = e.target.value;
                const permissionIds = Array.isArray(value)
                  ? value.map(id => {
                      const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
                      return isNaN(numId) ? null : numId;
                    }).filter(id => id !== null && !isNaN(id))
                  : [];
                console.log('Permissions sélectionnées après changement:', permissionIds);
                console.log('Valeur brute du Select:', value);
                console.log('État précédent:', nouveauRole.permissionIds);
                setNouveauRole(prev => ({
                  ...prev,
                  permissionIds: permissionIds
                }));
              }}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => {
                if (!selected || selected.length === 0) {
                  return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Sélectionner des permissions</Typography>;
                }
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((permId) => {
                      const perm = permissions.find((p) => {
                        const pId = typeof p.id === 'string' ? parseInt(p.id, 10) : Number(p.id);
                        return pId === permId;
                      });
                      return (
                        <Chip
                          key={permId}
                          label={perm?.nom || `Permission ${permId}`}
                          size="small"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                );
              }}
              disabled={permissionsLoading}
            >
              {permissionsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Chargement des permissions...
                </MenuItem>
              ) : permissions.length === 0 ? (
                <MenuItem disabled>Aucune permission disponible</MenuItem>
              ) : (
                permissions.map((perm) => {
                  const permId = typeof perm.id === 'string' ? parseInt(perm.id, 10) : Number(perm.id);
                  const selectedIds = (nouveauRole.permissionIds || [])
                    .map(id => {
                      const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
                      return isNaN(numId) ? null : numId;
                    })
                    .filter(id => id !== null && !isNaN(id));
                  const isChecked = selectedIds.some(selectedId => Number(selectedId) === Number(permId));
                  if (isChecked) {
                    console.log(`✓ Permission ${perm.nom} (ID: ${permId}) est cochée`);
                  }
                  return (
                    <MenuItem key={perm.id} value={permId}>
                      <Checkbox checked={isChecked} />
                      <ListItemText primary={perm.nom} secondary={perm.description} />
                    </MenuItem>
                  );
                })
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogueAjout(false);
            setNouveauRole({ nom: '', description: '', permissionIds: [] });
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
        setRoleAEditer(null);
        setNouveauRole({ nom: '', description: '', permissionIds: [] });
        setCurrentEditingRoleId(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le rôle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nom"
            value={nouveauRole.nom}
            onChange={(e) => setNouveauRole({ ...nouveauRole, nom: e.target.value })}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={nouveauRole.description}
            onChange={(e) => setNouveauRole({ ...nouveauRole, description: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="permissions-edit-label">Permissions</InputLabel>
            <Select
              key={`permissions-edit-${roleAEditer?.id || 'new'}-${(nouveauRole.permissionIds || []).join(',')}`}
              labelId="permissions-edit-label"
              multiple
              value={(() => {
                const normalizedIds = (nouveauRole.permissionIds || [])
                  .map(id => {
                    const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
                    return isNaN(numId) ? null : numId;
                  })
                  .filter(id => id !== null && !isNaN(id))
                  .sort((a, b) => a - b); // Trier pour une comparaison cohérente
                console.log('Valeur du Select (permissions normalisées):', normalizedIds);
                console.log('nouveauRole.permissionIds brut:', nouveauRole.permissionIds);
                return normalizedIds;
              })()}
              onChange={(e) => {
                const value = e.target.value;
                const permissionIds = Array.isArray(value)
                  ? value.map(id => {
                      const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
                      return isNaN(numId) ? null : numId;
                    }).filter(id => id !== null && !isNaN(id))
                  : [];
                console.log('Permissions sélectionnées après changement:', permissionIds);
                console.log('Valeur brute du Select:', value);
                console.log('État précédent:', nouveauRole.permissionIds);
                setNouveauRole(prev => ({
                  ...prev,
                  permissionIds: permissionIds
                }));
              }}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => {
                if (!selected || selected.length === 0) {
                  return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Sélectionner des permissions</Typography>;
                }
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((permId) => {
                      const perm = permissions.find((p) => {
                        const pId = typeof p.id === 'string' ? parseInt(p.id, 10) : Number(p.id);
                        return pId === permId;
                      });
                      return (
                        <Chip
                          key={permId}
                          label={perm?.nom || `Permission ${permId}`}
                          size="small"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                );
              }}
              disabled={permissionsLoading}
            >
              {permissionsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Chargement des permissions...
                </MenuItem>
              ) : permissions.length === 0 ? (
                <MenuItem disabled>Aucune permission disponible</MenuItem>
              ) : (
                permissions.map((perm) => {
                  const permId = typeof perm.id === 'string' ? parseInt(perm.id, 10) : Number(perm.id);
                  const selectedIds = (nouveauRole.permissionIds || [])
                    .map(id => {
                      const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
                      return isNaN(numId) ? null : numId;
                    })
                    .filter(id => id !== null && !isNaN(id));
                  const isChecked = selectedIds.some(selectedId => Number(selectedId) === Number(permId));
                  if (isChecked) {
                    console.log(`✓ Permission ${perm.nom} (ID: ${permId}) est cochée`);
                  }
                  return (
                    <MenuItem key={perm.id} value={permId}>
                      <Checkbox checked={isChecked} />
                      <ListItemText primary={perm.nom} secondary={perm.description} />
                    </MenuItem>
                  );
                })
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogueEdition(false);
            setRoleAEditer(null);
            setNouveauRole({ nom: '', description: '', permissionIds: [] });
            setCurrentEditingRoleId(null);
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
            Êtes-vous sûr de vouloir supprimer le rôle{' '}
            <strong>{roleASupprimer?.nom}</strong> ? Cette action est irréversible.
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
export default ListeRoles;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { notificationsService } from '../../api/notifications';
import { utilisateursService } from '../../api/utilisateurs';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
const ListeNotifications = () => {
  const { showSuccess, showError } = useToast();
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    utilisateurId: '',
    titre: '',
    message: '',
    type: 'INFO',
    categorie: 'SYSTEME',
  });
  const { data: notificationsData, isLoading } = useQuery(
    'notifications',
    notificationsService.getAll
  );
  const { data: usersData } = useQuery(
    'users',
    utilisateursService.getAll,
    { enabled: hasRole('ADMINISTRATEUR') }
  );
  const notifications = notificationsData?.data || [];
  const users = usersData?.data || [];
  const markAsReadMutation = useMutation(
    (id) => notificationsService.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
        showSuccess('Notification marquée comme lue');
      },
    }
  );
  const markAllAsReadMutation = useMutation(
    () => notificationsService.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
        showSuccess('Toutes les notifications marquées comme lues');
      },
    }
  );
  const deleteMutation = useMutation(
    (id) => notificationsService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
        showSuccess('Notification supprimée');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la suppression');
      },
    }
  );
  const deleteReadMutation = useMutation(
    () => notificationsService.deleteRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
        showSuccess('Notifications lues supprimées');
      },
    }
  );
  const createMutation = useMutation(
    (data) => notificationsService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
        showSuccess('Notification créée avec succès');
        setCreateDialogOpen(false);
        setFormData({
          utilisateurId: '',
          titre: '',
          message: '',
          type: 'INFO',
          categorie: 'SYSTEME',
        });
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la création');
      },
    }
  );
  const handleCreate = () => {
    createMutation.mutate(formData);
  };
  const getNotificationColor = (type) => {
    const colors = {
      INFO: 'info',
      SUCCESS: 'success',
      WARNING: 'warning',
      ERROR: 'error',
      URGENT: 'error',
    };
    return colors[type] || 'default';
  };
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const unreadCount = notifications.filter((n) => !n.lu).length;
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {unreadCount > 0 && (
            <>
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isLoading}
              >
                Tout marquer comme lu
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => deleteReadMutation.mutate()}
                disabled={deleteReadMutation.isLoading}
              >
                Supprimer les lues
              </Button>
            </>
          )}
          {hasRole('ADMINISTRATEUR') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Créer une notification
            </Button>
          )}
        </Box>
      </Box>
      {unreadCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
        </Alert>
      )}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Statut</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 4 }}>
                      <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Aucune notification
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    sx={{
                      backgroundColor: notification.lu ? 'transparent' : 'action.hover',
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={notification.lu ? 'Lu' : 'Non lu'}
                        size="small"
                        color={notification.lu ? 'default' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.type}
                        size="small"
                        color={getNotificationColor(notification.type)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: notification.lu ? 400 : 600 }}>
                      {notification.titre}
                    </TableCell>
                    <TableCell>{notification.message}</TableCell>
                    <TableCell>
                      <Chip label={notification.categorie} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{formatDate(notification.dateCreation)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {!notification.lu && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            disabled={markAsReadMutation.isLoading}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteMutation.mutate(notification.id)}
                          disabled={deleteMutation.isLoading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {}
      {hasRole('ADMINISTRATEUR') && (
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Créer une notification</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Utilisateur</InputLabel>
                  <Select
                    value={formData.utilisateurId}
                    onChange={(e) => setFormData({ ...formData, utilisateurId: e.target.value })}
                    label="Utilisateur"
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.prenom} {user.nom} ({user.username})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="INFO">INFO</MenuItem>
                    <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                    <MenuItem value="WARNING">WARNING</MenuItem>
                    <MenuItem value="ERROR">ERROR</MenuItem>
                    <MenuItem value="URGENT">URGENT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    label="Catégorie"
                  >
                    <MenuItem value="SYSTEME">SYSTEME</MenuItem>
                    <MenuItem value="RENDEZ_VOUS">RENDEZ_VOUS</MenuItem>
                    <MenuItem value="CONSULTATION">CONSULTATION</MenuItem>
                    <MenuItem value="HOSPITALISATION">HOSPITALISATION</MenuItem>
                    <MenuItem value="FACTURE">FACTURE</MenuItem>
                    <MenuItem value="PAIEMENT">PAIEMENT</MenuItem>
                    <MenuItem value="DOCUMENT">DOCUMENT</MenuItem>
                    <MenuItem value="RAPPEL">RAPPEL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={createMutation.isLoading || !formData.utilisateurId || !formData.titre || !formData.message}
            >
              {createMutation.isLoading ? 'Création...' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
export default ListeNotifications;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
  Button,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Edit as EditIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { utilisateursService } from '../../api/utilisateurs';
import { authService } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ROLE_ROUTES } from '../../config/api';
const profileSchema = yup.object({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  telephone: yup.string(),
});
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Le mot de passe actuel est requis'),
  newPassword: yup.string().required('Le nouveau mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: yup.string()
    .required('La confirmation du mot de passe est requise')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas'),
});
const ProfilUtilisateur = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const { data, isLoading, error } = useQuery(
    'myStaffProfile', 
    utilisateursService.getMyProfile,
    {
      retry: false,
      onError: (error) => {
        if (error.response?.status === 404) {
          console.error('Endpoint /api/utilisateurs/mon-profil not found. Please ensure the backend server is running and the endpoint is implemented.');
        }
      }
    }
  );
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors }, setValue: setProfileValue, watch: watchProfile } = useForm({
    resolver: yupResolver(profileSchema),
  });
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const profileMutation = useMutation(
    (data) => utilisateursService.updateMyProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('myStaffProfile');
        showSuccess('Profil mis à jour avec succès');
        setEditMode(false);
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      },
    }
  );
  const passwordMutation = useMutation(
    (data) => authService.changePassword(data.currentPassword, data.newPassword, data.confirmPassword),
    {
      onSuccess: () => {
        showSuccess('Mot de passe modifié avec succès');
        setPasswordDialogOpen(false);
        resetPassword();
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la modification du mot de passe');
      },
    }
  );
  const utilisateur = data?.data || data;
  React.useEffect(() => {
    if (utilisateur && !editMode) {
      setProfileValue('nom', utilisateur.nom || '');
      setProfileValue('prenom', utilisateur.prenom || '');
      setProfileValue('email', utilisateur.email || '');
      setProfileValue('telephone', utilisateur.telephone || '');
    }
  }, [utilisateur, editMode, setProfileValue]);
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    const is404 = error.response?.status === 404;
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {is404 ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Endpoint non trouvé (404)
              </Typography>
              <Typography variant="body2">
                L'endpoint <code>/api/utilisateurs/mon-profil</code> n'est pas disponible.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Veuillez vérifier que :
              </Typography>
              <ul style={{ marginTop: '8px', marginBottom: '8px', paddingLeft: '20px' }}>
                <li>Le serveur backend est démarré sur le port 8080</li>
                <li>L'endpoint <code>GET /api/utilisateurs/mon-profil</code> est implémenté dans le backend</li>
                <li>Vous êtes bien authentifié avec un token valide</li>
              </ul>
            </>
          ) : (
            `Erreur lors du chargement du profil: ${error.message}`
          )}
        </Alert>
        {is404 && (
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> Si cet endpoint n'est pas encore implémenté dans le backend, 
              vous pouvez utiliser l'endpoint <code>GET /api/utilisateurs/{'{id}'}</code> avec votre ID utilisateur.
            </Typography>
          </Alert>
        )}
      </Box>
    );
  }
  if (!utilisateur) {
    return (
      <Box>
        <Alert severity="warning">
          Profil non trouvé
        </Alert>
      </Box>
    );
  }
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const formaterDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const getRoleDisplayName = (role) => {
    const roleNames = {
      ADMINISTRATEUR: 'Administrateur',
      AGENT_ACCUEIL: 'Agent d\'Accueil',
      MEDECIN: 'Médecin',
      INFIRMIER: 'Infirmier',
      COMPTABLE: 'Comptable',
      DIRECTEUR: 'Directeur',
      PATIENT: 'Patient',
    };
    return roleNames[role] || role;
  };
  const roles = utilisateur.roles || [];
  const rolePrincipal = roles[0];
  const onProfileSubmit = (data) => {
    profileMutation.mutate(data);
  };
  const onPasswordSubmit = (data) => {
    passwordMutation.mutate(data);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Mon Profil
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setPasswordDialogOpen(true)}
          >
            Changer le mot de passe
          </Button>
          {!editMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Modifier le profil
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSubmitProfile(onProfileSubmit)}
                disabled={profileMutation.isLoading}
              >
                {profileMutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditMode(false);
                  setProfileValue('nom', utilisateur.nom || '');
                  setProfileValue('prenom', utilisateur.prenom || '');
                  setProfileValue('email', utilisateur.email || '');
                  setProfileValue('telephone', utilisateur.telephone || '');
                }}
              >
                Annuler
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '2.5rem',
              }}
            >
              {utilisateur.prenom?.charAt(0)?.toUpperCase()}
              {utilisateur.nom?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {utilisateur.prenom} {utilisateur.nom}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {utilisateur.username}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {roles.map((role) => (
                  <Chip
                    key={role}
                    icon={<ShieldIcon />}
                    label={getRoleDisplayName(role)}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
                <Chip
                  label={utilisateur.actif ? 'Actif' : 'Inactif'}
                  size="small"
                  variant="outlined"
                  color={utilisateur.actif ? 'success' : 'default'}
                />
              </Box>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nom d'utilisateur
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {utilisateur.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nom
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  {...registerProfile('nom')}
                  error={!!profileErrors.nom}
                  helperText={profileErrors.nom?.message}
                />
              ) : (
                <Typography variant="body1">{utilisateur.nom}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Prénom
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  {...registerProfile('prenom')}
                  error={!!profileErrors.prenom}
                  helperText={profileErrors.prenom?.message}
                />
              ) : (
                <Typography variant="body1">{utilisateur.prenom}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  {...registerProfile('email')}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email?.message}
                />
              ) : (
                <Typography variant="body1">{utilisateur.email || '-'}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Téléphone
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  {...registerProfile('telephone')}
                  error={!!profileErrors.telephone}
                  helperText={profileErrors.telephone?.message}
                />
              ) : (
                <Typography variant="body1">{utilisateur.telephone || '-'}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Statut
              </Typography>
              <Chip
                label={utilisateur.actif ? 'Actif' : 'Inactif'}
                size="small"
                variant="outlined"
                color={utilisateur.actif ? 'success' : 'default'}
              />
            </Grid>
            {utilisateur.dateCreation && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date de création
                </Typography>
                <Typography variant="body1">{formaterDateTime(utilisateur.dateCreation)}</Typography>
              </Grid>
            )}
            {utilisateur.dateModification && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dernière modification
                </Typography>
                <Typography variant="body1">{formaterDateTime(utilisateur.dateModification)}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      {}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Rôles et Permissions
          </Typography>
          <Grid container spacing={2}>
            {roles.length > 0 ? (
              roles.map((role) => (
                <Grid item xs={12} sm={6} md={4} key={role}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? '#0c1017' : '#ffffff',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {getRoleDisplayName(role)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Accès au tableau de bord: {ROLE_ROUTES[role] ? 'Oui' : 'Non'}
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">Aucun rôle assigné</Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      {}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Mot de passe actuel"
                  {...registerPassword('currentPassword')}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Nouveau mot de passe"
                  {...registerPassword('newPassword')}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  {...registerPassword('confirmPassword')}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={passwordMutation.isLoading}>
              {passwordMutation.isLoading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default ProfilUtilisateur;

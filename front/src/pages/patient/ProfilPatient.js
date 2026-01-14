import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
  TextField,
  Button,
} from '@mui/material';
import { AccountCircle as AccountIcon, Edit as EditIcon } from '@mui/icons-material';
import { patientsService } from '../../api/patients';
import { useToast } from '../../hooks/useToast';
const profileSchema = yup.object({
  adresse: yup.string(),
  telephone: yup.string(),
  email: yup.string().email('Email invalide'),
});
const ProfilPatient = () => {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const { data, isLoading } = useQuery('myProfile', patientsService.getMyProfile);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(profileSchema),
  });
  const profileMutation = useMutation(
    (data) => patientsService.updateMyProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('myProfile');
        showSuccess('Profil mis à jour avec succès');
        setEditMode(false);
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      },
    }
  );
  const patient = data?.data;
  React.useEffect(() => {
    if (patient && !editMode) {
      setValue('adresse', patient.adresse || '');
      setValue('telephone', patient.telephone || '');
      setValue('email', patient.email || '');
    }
  }, [patient, editMode, setValue]);
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!patient) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Profil non trouvé
        </Typography>
      </Box>
    );
  }
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const onProfileSubmit = (data) => {
    profileMutation.mutate(data);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Mon profil
        </Typography>
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
              onClick={handleSubmit(onProfileSubmit)}
              disabled={profileMutation.isLoading}
            >
              {profileMutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditMode(false);
                setValue('adresse', patient.adresse || '');
                setValue('telephone', patient.telephone || '');
                setValue('email', patient.email || '');
              }}
            >
              Annuler
            </Button>
          </Box>
        )}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
              <AccountIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {patient.prenom} {patient.nom}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Patient
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Date de naissance
              </Typography>
              <Typography variant="body1">{formaterDate(patient.dateNaissance)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Sexe
              </Typography>
              <Typography variant="body1">{patient.sexe}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Numéro d'identification
              </Typography>
              <Typography variant="body1">{patient.numeroIdentification}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Téléphone
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  {...register('telephone')}
                  error={!!errors.telephone}
                  helperText={errors.telephone?.message}
                />
              ) : (
                <Typography variant="body1">{patient.telephone || '-'}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Email
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              ) : (
                <Typography variant="body1">{patient.email || '-'}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Adresse
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  {...register('adresse')}
                  error={!!errors.adresse}
                  helperText={errors.adresse?.message}
                />
              ) : (
                <Typography variant="body1">{patient.adresse || '-'}</Typography>
              )}
            </Grid>
            {patient.antecedentsMedicaux && (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Antécédents médicaux
                </Typography>
                <Typography variant="body1">{patient.antecedentsMedicaux}</Typography>
              </Grid>
            )}
            {patient.allergies && (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Allergies
                </Typography>
                <Typography variant="body1">{patient.allergies}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
export default ProfilPatient;

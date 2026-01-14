import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { utilisateursService } from '../../api/utilisateurs';
import { useToast } from '../../hooks/useToast';
import { rolesService } from '../../api/roles';
const schema = yup.object({
  username: yup.string().required('Le nom d\'utilisateur est requis'),
  password: yup.string().when('estEdition', {
    is: false,
    then: (schema) => schema.required('Le mot de passe est requis'),
  }),
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  telephone: yup.string(),
  roleIds: yup.array().min(1, 'Au moins un rôle est requis'),
  actif: yup.boolean(),
});
const FormulaireUtilisateur = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const estEdition = !!id;
  const [roles, setRoles] = useState([]);
  const { data: utilisateur, isLoading } = useQuery(
    ['utilisateur', id],
    () => utilisateursService.getById(id),
    { enabled: estEdition }
  );
  const { data: rolesData, isLoading: rolesLoading } = useQuery('roles', rolesService.getAll, {
    onSuccess: (data) => {
      const rolesList = data?.data || data || [];
      setRoles(Array.isArray(rolesList) ? rolesList : []);
    },
  });
  useEffect(() => {
    if (rolesData) {
      const rolesList = rolesData?.data || rolesData || [];
      setRoles(Array.isArray(rolesList) ? rolesList : []);
    }
  }, [rolesData]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      actif: true,
      roleIds: [],
    },
  });
  useEffect(() => {
    if (utilisateur) {
      const data = utilisateur?.data || utilisateur;
      if (data) {
        setValue('username', data.username || '');
        setValue('nom', data.nom || '');
        setValue('prenom', data.prenom || '');
        setValue('email', data.email || '');
        setValue('telephone', data.telephone || '');
        setValue('actif', data.actif !== undefined ? data.actif : true);
        const roleIds = data.roles?.map((role) => {
          const roleId = typeof role === 'object' ? role.id : role;
          return typeof roleId === 'string' ? parseInt(roleId, 10) : Number(roleId);
        }).filter(id => !isNaN(id)) || [];
        setValue('roleIds', roleIds);
      }
    }
  }, [utilisateur, setValue]);
  const mutation = useMutation(
    (data) => {
      const roleIds = Array.isArray(data.roleIds) 
        ? data.roleIds.map((roleId) => {
            const numId = typeof roleId === 'string' ? parseInt(roleId, 10) : Number(roleId);
            return isNaN(numId) ? roleId : numId;
          })
        : [];
      const donneesSoumission = {
        username: data.username,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone || null,
        actif: data.actif !== undefined ? data.actif : true,
        roleIds: roleIds,
      };
      return estEdition
        ? utilisateursService.update(id, donneesSoumission)
        : utilisateursService.create(donneesSoumission);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('utilisateurs');
        showSuccess(estEdition ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès');
        navigate('/admin/utilisateurs');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || (estEdition ? 'Erreur lors de la modification de l\'utilisateur' : 'Erreur lors de la création de l\'utilisateur'));
      },
    }
  );
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  if (estEdition && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const rolesLoaded = roles.length > 0;
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        {estEdition ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom d'utilisateur"
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={estEdition}
                />
              </Grid>
              {!estEdition && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Mot de passe"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  {...register('nom')}
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  {...register('prenom')}
                  error={!!errors.prenom}
                  helperText={errors.prenom?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  {...register('telephone')}
                  error={!!errors.telephone}
                  helperText={errors.telephone?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.roleIds} disabled={rolesLoading}>
                  <InputLabel id="roles-label">Rôles</InputLabel>
                  <Select
                    labelId="roles-label"
                    multiple
                    value={watch('roleIds') || []}
                    onChange={(e) => {
                      const value = e.target.value;
                      const roleIds = typeof value === 'string' 
                        ? value.split(',').map(id => Number(id)).filter(id => !isNaN(id))
                        : value.map(id => Number(id)).filter(id => !isNaN(id));
                      setValue('roleIds', roleIds, { shouldValidate: true });
                    }}
                    input={<OutlinedInput label="Rôles" />}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) {
                        return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Sélectionner des rôles</Typography>;
                      }
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((roleId) => {
                            const roleIdNum = typeof roleId === 'string' ? parseInt(roleId, 10) : Number(roleId);
                            const role = roles.find((r) => {
                              const rId = typeof r.id === 'string' ? parseInt(r.id, 10) : Number(r.id);
                              return rId === roleIdNum;
                            });
                            return (
                              <Chip
                                key={roleId}
                                label={role?.nom || `Rôle ${roleId}`}
                                size="small"
                                variant="outlined"
                              />
                            );
                          })}
                        </Box>
                      );
                    }}
                  >
                    {rolesLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Chargement des rôles...
                      </MenuItem>
                    ) : roles.length === 0 ? (
                      <MenuItem disabled>Aucun rôle disponible</MenuItem>
                    ) : (
                      roles.map((role) => {
                        const roleId = typeof role.id === 'string' ? parseInt(role.id, 10) : Number(role.id);
                        return (
                          <MenuItem key={role.id} value={roleId}>
                            {role.nom}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                  {errors.roleIds && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.roleIds.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox {...register('actif')} checked={watch('actif')} />}
                  label="Utilisateur actif"
                />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de {estEdition ? 'la modification' : 'la création'} de l'utilisateur
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained" disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/admin/utilisateurs')}>
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulaireUtilisateur;

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { litsService } from '../../api/lits';
import { useToast } from '../../hooks/useToast';
const schema = yup.object({
  numeroLit: yup.string().required('Le numéro de lit est requis'),
  service: yup.string().required('Le service est requis'),
  chambre: yup.string().required('La chambre est requise'),
  statut: yup.string().required('Le statut est requis'),
  notes: yup.string(),
});
const FormulaireLit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const estEdition = !!id;
  const { data: lit, isLoading } = useQuery(
    ['lit', id],
    () => litsService.getById(id),
    { enabled: estEdition }
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      numeroLit: '',
      service: '',
      chambre: '',
      statut: '',
      notes: '',
    },
  });
  useEffect(() => {
    if (lit) {
      const data = lit.data || lit;
      console.log('Loading bed data:', data);
      setValue('numeroLit', data.numeroLit || '');
      setValue('service', data.service || '');
      setValue('chambre', data.chambre || '');
      setValue('statut', data.statut || '');
      setValue('notes', data.notes || '');
    }
  }, [lit, setValue]);
  const mutation = useMutation(
    (data) => {
      if (estEdition) {
        return litsService.update(id, data);
      }
      return litsService.create(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('lits');
        showSuccess(estEdition ? 'Lit modifié avec succès' : 'Lit créé avec succès');
        navigate('/lits');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || `Erreur lors de ${estEdition ? 'la modification' : 'la création'} du lit`);
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
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        {estEdition ? 'Modifier le lit' : 'Nouveau lit'}
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numéro de lit"
                  required
                  {...register('numeroLit')}
                  error={!!errors.numeroLit}
                  helperText={errors.numeroLit?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service"
                  required
                  {...register('service')}
                  error={!!errors.service}
                  helperText={errors.service?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chambre"
                  required
                  {...register('chambre')}
                  error={!!errors.chambre}
                  helperText={errors.chambre?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="statut"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Statut"
                      required
                      error={!!errors.statut}
                      helperText={errors.statut?.message}
                      value={field.value || ''}
                    >
                      <MenuItem value="">
                        <em>Sélectionner un statut</em>
                      </MenuItem>
                      <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                      <MenuItem value="OCCUPE">Occupé</MenuItem>
                      <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                      <MenuItem value="RESERVE">Réservé</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  {...register('notes')}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de {estEdition ? 'la modification' : 'la création'} du lit
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/beds')}>
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulaireLit;

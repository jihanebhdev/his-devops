import React, { useEffect, useState } from 'react';
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
  Autocomplete,
} from '@mui/material';
import { dossiersService } from '../../api/dossiers';
import { patientsService } from '../../api/patients';
import { useToast } from '../../hooks/useToast';
const schema = yup.object({
  patientId: yup.number().required('Le patient est requis'),
  historiqueMedical: yup.string(),
  notesCliniques: yup.string(),
  groupeSanguin: yup.string(),
  rhesus: yup.string(),
});
const FormulaireDossierMedical = () => {
  const navigate = useNavigate();
  const { id, patientId } = useParams();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const estEdition = !!id;
  const [patients, setPatients] = useState([]);
  const { data: dossier, isLoading } = useQuery(
    ['dossier', id, patientId],
    () => {
      if (patientId) {
        return dossiersService.getByPatient(patientId);
      }
      return dossiersService.getById(id);
    },
    { enabled: estEdition || !!patientId }
  );
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  useEffect(() => {
    if (patientsData?.data) {
      setPatients(patientsData.data);
    }
  }, [patientsData]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (dossier?.data || dossier) {
      const data = dossier.data || dossier;
      setValue('patientId', data.patientId || data.patient?.id || patientId);
      setValue('historiqueMedical', data.historiqueMedical || '');
      setValue('notesCliniques', data.notesCliniques || '');
      setValue('groupeSanguin', data.groupeSanguin || '');
      setValue('rhesus', data.rhesus || '');
    } else if (patientId) {
      setValue('patientId', Number(patientId));
    }
  }, [dossier, setValue, patientId]);
  const mutation = useMutation(
    (data) => {
      if (estEdition) {
        return dossiersService.update(id, data);
      }
      return dossiersService.create(data);
    },
    {
      onSuccess: (response) => {
        const finalPatientId = patientId || watch('patientId');
        queryClient.invalidateQueries('dossiers');
        queryClient.invalidateQueries(['dossier', id]);
        queryClient.invalidateQueries(['dossier', finalPatientId]);
        queryClient.invalidateQueries(['patient', finalPatientId]);
        showSuccess(estEdition ? 'Dossier médical modifié avec succès' : 'Dossier médical créé avec succès');
        if (finalPatientId) {
          navigate(`/patients/${finalPatientId}`);
        } else {
          navigate('/patients');
        }
      },
      onError: (error) => {
        showError(error?.response?.data?.message || (estEdition ? 'Erreur lors de la modification du dossier médical' : 'Erreur lors de la création du dossier médical'));
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
        {estEdition ? 'Modifier le dossier médical' : 'Nouveau dossier médical'}
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
                  value={patients.find((p) => p.id === watch('patientId')) || null}
                  onChange={(event, newValue) => {
                    setValue('patientId', newValue?.id || null);
                  }}
                  disabled={estEdition}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient"
                      required
                      error={!!errors.patientId}
                      helperText={errors.patientId?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="groupeSanguin"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Groupe sanguin"
                      value={field.value || ''}
                    >
                      <MenuItem value="">Non renseigné</MenuItem>
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="AB">AB</MenuItem>
                      <MenuItem value="O">O</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="rhesus"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Rhésus"
                      value={field.value || ''}
                    >
                      <MenuItem value="">Non renseigné</MenuItem>
                      <MenuItem value="POSITIF">Positif</MenuItem>
                      <MenuItem value="NEGATIF">Négatif</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Historique médical"
                  {...register('historiqueMedical')}
                  error={!!errors.historiqueMedical}
                  helperText={errors.historiqueMedical?.message}
                  placeholder="Antécédents du patient, historique médical, antécédents familiaux, allergies, médicaments, etc."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Notes cliniques"
                  {...register('notesCliniques')}
                  error={!!errors.notesCliniques}
                  helperText={errors.notesCliniques?.message}
                  placeholder="Notes importantes, observations cliniques, recommandations, etc."
                />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de {estEdition ? 'la modification' : 'la création'} du dossier médical
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
              <Button
                variant="outlined"
                onClick={() => {
                  const finalPatientId = patientId || watch('patientId');
                  if (finalPatientId) {
                    navigate(`/patients/${finalPatientId}`);
                  } else {
                    navigate('/patients');
                  }
                }}
              >
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulaireDossierMedical;

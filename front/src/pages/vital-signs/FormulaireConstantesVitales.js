import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { constantesService } from '../../api/constantes';
import { patientsService } from '../../api/patients';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
const schema = yup.object({
  patientId: yup.number().required('Le patient est requis'),
  dateHeure: yup.date().required('La date et l\'heure sont requises'),
  temperature: yup.number().nullable(),
  tensionArterielleSystolique: yup.number().nullable(),
  tensionArterielleDiastolique: yup.number().nullable(),
  frequenceCardiaque: yup.number().nullable(),
  frequenceRespiratoire: yup.number().nullable(),
  poids: yup.number().nullable(),
  taille: yup.number().nullable(),
  glycemie: yup.number().nullable(),
  saturationOxygene: yup.number().nullable(),
  notes: yup.string(),
});
const FormulaireConstantesVitales = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [patients, setPatients] = useState([]);
  const patientIdParam = searchParams.get('patientId');
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  useEffect(() => {
    if (patientsData?.data) {
      setPatients(patientsData.data);
    }
  }, [patientsData]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dateHeure: dayjs(),
    },
  });
  useEffect(() => {
    if (patientIdParam) {
      setValue('patientId', parseInt(patientIdParam));
    }
  }, [patientIdParam, setValue]);
  const mutation = useMutation(
    (data) => {
      const donneesSoumission = {
        ...data,
        infirmierId: user?.id || 1,
        dateHeure: data.dateHeure ? dayjs(data.dateHeure).toISOString() : null,
      };
      return constantesService.create(donneesSoumission);
    },
    {
      onSuccess: (response) => {
        const finalPatientId = patientIdParam || watch('patientId');
        queryClient.invalidateQueries('constantes');
        queryClient.invalidateQueries(['constantes', finalPatientId]);
        queryClient.invalidateQueries(['patient', finalPatientId]);
        showSuccess('Constantes vitales enregistrées avec succès');
        if (finalPatientId) {
          navigate(`/patients/${finalPatientId}`);
        } else {
          navigate('/patients');
        }
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de l\'enregistrement des constantes vitales');
      },
    }
  );
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Enregistrer des constantes vitales
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient"
                      error={!!errors.patientId}
                      helperText={errors.patientId?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date et heure"
                    value={watch('dateHeure')}
                    onChange={(date) => setValue('dateHeure', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateHeure,
                        helperText: errors.dateHeure?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Température (°C)"
                  {...register('temperature')}
                  error={!!errors.temperature}
                  helperText={errors.temperature?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tension systolique (mmHg)"
                  {...register('tensionArterielleSystolique')}
                  error={!!errors.tensionArterielleSystolique}
                  helperText={errors.tensionArterielleSystolique?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tension diastolique (mmHg)"
                  {...register('tensionArterielleDiastolique')}
                  error={!!errors.tensionArterielleDiastolique}
                  helperText={errors.tensionArterielleDiastolique?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fréquence cardiaque (bpm)"
                  {...register('frequenceCardiaque')}
                  error={!!errors.frequenceCardiaque}
                  helperText={errors.frequenceCardiaque?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fréquence respiratoire (rpm)"
                  {...register('frequenceRespiratoire')}
                  error={!!errors.frequenceRespiratoire}
                  helperText={errors.frequenceRespiratoire?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Poids (kg)"
                  {...register('poids')}
                  error={!!errors.poids}
                  helperText={errors.poids?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Taille (cm)"
                  {...register('taille')}
                  error={!!errors.taille}
                  helperText={errors.taille?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Glycémie (g/L)"
                  {...register('glycemie')}
                  error={!!errors.glycemie}
                  helperText={errors.glycemie?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Saturation O₂ (%)"
                  {...register('saturationOxygene')}
                  error={!!errors.saturationOxygene}
                  helperText={errors.saturationOxygene?.message}
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
                Erreur lors de l'enregistrement des constantes
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained" disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  const finalPatientId = patientIdParam || watch('patientId');
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
export default FormulaireConstantesVitales;

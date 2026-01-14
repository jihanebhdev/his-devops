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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { rendezvousService } from '../../api/rendezvous';
import { useToast } from '../../hooks/useToast';
import { patientsService } from '../../api/patients';
import { utilisateursService } from '../../api/utilisateurs';
const schema = yup.object({
  patientId: yup.number().required('Le patient est requis'),
  medecinId: yup.number().required('Le médecin est requis'),
  dateHeure: yup.date().required('La date et l\'heure sont requises'),
  motif: yup.string().required('Le motif est requis'),
  notes: yup.string(),
});
const FormulaireRendezVous = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const estEdition = !!id;
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const { data: rendezvous, isLoading } = useQuery(
    ['rendezvous', id],
    () => rendezvousService.getById(id),
    { enabled: estEdition }
  );
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const { data: medecinsData } = useQuery('medecins', utilisateursService.getAllDoctors);
  useEffect(() => {
    if (patientsData) {
      const data = patientsData.data || patientsData;
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error('Patients data is not an array:', data);
        setPatients([]);
      }
    }
  }, [patientsData]);
  useEffect(() => {
    if (medecinsData) {
      const data = medecinsData.data || medecinsData;
      if (Array.isArray(data)) {
        setMedecins(data);
      } else {
        console.error('Medecins data is not an array:', data);
        setMedecins([]);
      }
    }
  }, [medecinsData]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dateHeure: dayjs(),
      medecinId: undefined,
      patientId: undefined,
    },
  });
  useEffect(() => {
    if (rendezvous) {
      const data = rendezvous.data || rendezvous;
      console.log('Chargement des données du rendez-vous:', data);
      if (data.patientId) setValue('patientId', data.patientId);
      if (data.medecinId) setValue('medecinId', data.medecinId);
      if (data.dateHeure) setValue('dateHeure', dayjs(data.dateHeure));
      if (data.motif) setValue('motif', data.motif);
      if (data.notes) setValue('notes', data.notes);
    }
  }, [rendezvous, setValue]);
  const mutation = useMutation(
    (data) => {
      const donneesSoumission = {
        ...data,
        dateHeure: data.dateHeure ? dayjs(data.dateHeure).toISOString() : null,
      };
      return estEdition
        ? rendezvousService.update(id, donneesSoumission)
        : rendezvousService.create(donneesSoumission);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('rendezvous');
        showSuccess(estEdition ? 'Rendez-vous modifié avec succès' : 'Rendez-vous créé avec succès');
        const patientId = watch('patientId');
        if (patientId) {
          navigate(`/patients/${patientId}`);
        } else {
          navigate('/rendezvous');
        }
      },
      onError: (error) => {
        showError(error?.response?.data?.message || (estEdition ? 'Erreur lors de la modification du rendez-vous' : 'Erreur lors de la création du rendez-vous'));
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
        {estEdition ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={patients || []}
                  getOptionLabel={(option) => `${option.prenom || ''} ${option.nom || ''}`}
                  value={patients?.find((p) => p.id === watch('patientId')) || null}
                  onChange={(event, newValue) => {
                    setValue('patientId', newValue?.id || null);
                  }}
                  loading={!patientsData}
                  noOptionsText="Aucun patient disponible"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient"
                      required
                      error={!!errors.patientId}
                      helperText={errors.patientId?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {!patientsData ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={medecins || []}
                  getOptionLabel={(option) => `Dr. ${option.prenom || ''} ${option.nom || ''}`}
                  value={medecins?.find((m) => m.id === watch('medecinId')) || null}
                  onChange={(event, newValue) => {
                    setValue('medecinId', newValue?.id || null);
                  }}
                  loading={!medecinsData}
                  noOptionsText="Aucun médecin disponible"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Médecin"
                      required
                      error={!!errors.medecinId}
                      helperText={errors.medecinId?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {!medecinsData ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="dateHeure"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        label="Date et heure"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.dateHeure,
                            helperText: errors.dateHeure?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motif"
                  required
                  {...register('motif')}
                  error={!!errors.motif}
                  helperText={errors.motif?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  {...register('notes')}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de {estEdition ? 'la modification' : 'la création'} du rendez-vous
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
                  if (estEdition && rendezvous) {
                    const data = rendezvous.data || rendezvous;
                    if (data.patientId) {
                      navigate(`/patients/${data.patientId}`);
                      return;
                    }
                  }
                  navigate('/rendezvous');
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
export default FormulaireRendezVous;

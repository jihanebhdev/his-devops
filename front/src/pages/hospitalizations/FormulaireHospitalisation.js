import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
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
import { useToast } from '../../hooks/useToast';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { hospitalisationsService } from '../../api/hospitalisations';
import { patientsService } from '../../api/patients';
import { utilisateursService } from '../../api/utilisateurs';
import { litsService } from '../../api/lits';
const schema = yup.object({
  patientId: yup.number().required('Le patient est requis'),
  medecinId: yup.number().required('Le médecin est requis'),
  litId: yup.number().required('Le lit est requis'),
  dateAdmission: yup.date().required('La date d\'admission est requise'),
  motifAdmission: yup.string().required('Le motif d\'admission est requis'),
  diagnostic: yup.string(),
});
const FormulaireHospitalisation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [lits, setLits] = useState([]);
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const { data: medecinsData } = useQuery('medecins', utilisateursService.getAllDoctors);
  const { data: litsData } = useQuery('lits', litsService.getAll);
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
  useEffect(() => {
    if (litsData) {
      const data = litsData.data || litsData;
      console.log('Lits data received:', data);
      if (Array.isArray(data)) {
        const litsDisponibles = data.filter(lit => lit.statut === 'DISPONIBLE');
        console.log('Available beds:', litsDisponibles);
        setLits(litsDisponibles);
      } else {
        console.error('Lits data is not an array:', data);
        setLits([]);
      }
    }
  }, [litsData]);
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
      dateAdmission: dayjs(),
      medecinId: undefined,
      patientId: undefined,
      litId: undefined,
    },
  });
  const mutation = useMutation(
    (data) => {
      const donneesSoumission = {
        ...data,
        dateAdmission: data.dateAdmission ? dayjs(data.dateAdmission).format('YYYY-MM-DDTHH:mm:ss') : null,
      };
      return hospitalisationsService.create(donneesSoumission);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hospitalisations');
        showSuccess('Hospitalisation créée avec succès');
        navigate('/hospitalisations');
      },
      onError: (error) => {
        showError(error?.response?.data?.message || 'Erreur lors de la création de l\'hospitalisation');
      },
    }
  );
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Nouvelle hospitalisation
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
                <Controller
                  name="litId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Lit disponible"
                      required
                      error={!!errors.litId}
                      helperText={errors.litId?.message || (lits.length === 0 ? 'Aucun lit disponible' : '')}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                      disabled={!litsData || lits.length === 0}
                      InputProps={{
                        endAdornment: !litsData ? <CircularProgress size={20} /> : null,
                      }}
                    >
                      <MenuItem value="">
                        <em>{lits.length === 0 ? 'Aucun lit disponible' : 'Sélectionner un lit'}</em>
                      </MenuItem>
                      {lits.map((lit) => (
                        <MenuItem key={lit.id} value={lit.id}>
                          Lit {lit.numeroLit} - {lit.service} - Chambre {lit.chambre}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="dateAdmission"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        label="Date et heure d'admission"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.dateAdmission,
                            helperText: errors.dateAdmission?.message,
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
                  label="Motif d'admission"
                  required
                  {...register('motifAdmission')}
                  error={!!errors.motifAdmission}
                  helperText={errors.motifAdmission?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Diagnostic"
                  {...register('diagnostic')}
                  error={!!errors.diagnostic}
                  helperText={errors.diagnostic?.message}
                />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de la création de l'hospitalisation
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
              <Button variant="outlined" onClick={() => navigate('/hospitalisations')}>
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulaireHospitalisation;

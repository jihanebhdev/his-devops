import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
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
import { assurancesService } from '../../api/assurances';
import { patientsService } from '../../api/patients';
import { useToast } from '../../hooks/useToast';
const schema = yup.object({
  patientId: yup.number().required('Le patient est requis'),
  nomAssurance: yup.string().required('Le nom de l\'assurance est requis'),
  numeroContrat: yup.string().required('Le numéro de contrat est requis'),
  tauxCouverture: yup
    .number()
    .required('Le taux de couverture est requis')
    .min(0)
    .max(100),
});
const FormulaireAssurance = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [patients, setPatients] = useState([]);
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patientId: null,
      nomAssurance: '',
      numeroContrat: '',
      tauxCouverture: 0,
    },
  });
  const mutation = useMutation(
    (data) => {
      console.log('Submitting insurance data:', data);
      return assurancesService.create(data);
    },
    {
      onSuccess: (response) => {
        console.log('Insurance created successfully:', response);
        queryClient.invalidateQueries('assurances');
        showSuccess('Assurance créée avec succès');
        navigate('/assurances');
      },
      onError: (error) => {
        console.error('Error creating insurance:', error);
        showError(error?.response?.data?.message || 'Erreur lors de la création de l\'assurance');
      },
    }
  );
  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    if (!data.patientId) {
      showError('Veuillez sélectionner un patient');
      return;
    }
    const submissionData = {
      ...data,
      tauxCouverture: Number(data.tauxCouverture),
    };
    console.log('Processed data:', submissionData);
    mutation.mutate(submissionData);
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Nouvelle assurance
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
                    console.log('Patient selected:', newValue);
                    setValue('patientId', newValue?.id || null, { shouldValidate: true });
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
                <TextField
                  fullWidth
                  label="Nom de l'assurance"
                  required
                  {...register('nomAssurance')}
                  error={!!errors.nomAssurance}
                  helperText={errors.nomAssurance?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numéro de contrat"
                  required
                  {...register('numeroContrat')}
                  error={!!errors.numeroContrat}
                  helperText={errors.numeroContrat?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Taux de couverture (%)"
                  required
                  {...register('tauxCouverture', { valueAsNumber: true })}
                  error={!!errors.tauxCouverture}
                  helperText={errors.tauxCouverture?.message}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {mutation.error?.response?.data?.message || 'Erreur lors de la création de l\'assurance'}
              </Alert>
            )}
            {mutation.isSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Assurance créée avec succès
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
              <Button variant="outlined" onClick={() => navigate('/assurances')}>
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulaireAssurance;

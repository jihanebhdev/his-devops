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
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { patientsService } from '../../api/patients';
import { useToast } from '../../hooks/useToast';
const schema = yup.object({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  dateNaissance: yup.date().required('La date de naissance est requise'),
  sexe: yup.string().required('Le sexe est requis'),
  numeroIdentification: yup.string().required('Le numéro d\'identification est requis'),
  adresse: yup.string(),
  telephone: yup.string(),
  email: yup.string().email('Email invalide'),
  antecedentsMedicaux: yup.string(),
  allergies: yup.string(),
  creerCompteUtilisateur: yup.boolean(),
  username: yup.string().when('creerCompteUtilisateur', {
    is: true,
    then: (schema) => schema.required('Le nom d\'utilisateur est requis'),
  }),
  password: yup.string().when('creerCompteUtilisateur', {
    is: true,
    then: (schema) => schema.required('Le mot de passe est requis'),
  }),
});
const FormulairePatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const estEdition = !!id;
  const { data: patient, isLoading } = useQuery(
    ['patient', id],
    () => patientsService.getById(id),
    { enabled: estEdition }
  );
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
      creerCompteUtilisateur: false,
      dateNaissance: dayjs(),
    },
  });
  const creerCompte = watch('creerCompteUtilisateur');
  useEffect(() => {
    if (patient?.data) {
      const data = patient.data;
      setValue('nom', data.nom || '');
      setValue('prenom', data.prenom || '');
      setValue('dateNaissance', data.dateNaissance ? dayjs(data.dateNaissance) : dayjs());
      setValue('sexe', data.sexe || '');
      setValue('numeroIdentification', data.numeroIdentification || '');
      setValue('adresse', data.adresse || '');
      setValue('telephone', data.telephone || '');
      setValue('email', data.email || '');
      setValue('antecedentsMedicaux', data.antecedentsMedicaux || '');
      setValue('allergies', data.allergies || '');
    }
  }, [patient, setValue]);
  const mutation = useMutation(
    (data) => {
      const donneesSoumission = {
        ...data,
        dateNaissance: data.dateNaissance ? dayjs(data.dateNaissance).format('YYYY-MM-DD') : null,
      };
      return estEdition ? patientsService.update(id, donneesSoumission) : patientsService.create(donneesSoumission);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('patients');
        showSuccess(estEdition ? 'Patient modifié avec succès' : 'Patient créé avec succès');
        if (estEdition) {
          navigate(`/patients/${id}`);
        } else {
          const newPatientId = response?.data?.id || response?.id;
          if (newPatientId) {
            navigate(`/patients/${newPatientId}`);
          } else {
            navigate('/patients');
          }
        }
      },
      onError: (error) => {
        showError(error?.response?.data?.message || (estEdition ? 'Erreur lors de la modification du patient' : 'Erreur lors de la création du patient'));
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
        {estEdition ? 'Modifier le patient' : 'Nouveau patient'}
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  {...register('nom')}
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  {...register('prenom')}
                  error={!!errors.prenom}
                  helperText={errors.prenom?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="dateNaissance"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date de naissance"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dateNaissance,
                            helperText: errors.dateNaissance?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Sexe"
                  {...register('sexe')}
                  error={!!errors.sexe}
                  helperText={errors.sexe?.message}
                  defaultValue=""
                >
                  <MenuItem value="MASCULIN">Masculin</MenuItem>
                  <MenuItem value="FEMININ">Féminin</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Numéro d'identification"
                  {...register('numeroIdentification')}
                  error={!!errors.numeroIdentification}
                  helperText={errors.numeroIdentification?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  {...register('telephone')}
                  error={!!errors.telephone}
                  helperText={errors.telephone?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Adresse"
                  {...register('adresse')}
                  error={!!errors.adresse}
                  helperText={errors.adresse?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Antécédents médicaux"
                  {...register('antecedentsMedicaux')}
                  error={!!errors.antecedentsMedicaux}
                  helperText={errors.antecedentsMedicaux?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Allergies"
                  {...register('allergies')}
                  error={!!errors.allergies}
                  helperText={errors.allergies?.message}
                />
              </Grid>
              {!estEdition && (
                <>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('creerCompteUtilisateur')}
                          checked={creerCompte}
                          onChange={(e) => setValue('creerCompteUtilisateur', e.target.checked)}
                        />
                      }
                      label="Créer un compte utilisateur pour ce patient"
                    />
                  </Grid>
                  {creerCompte && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nom d'utilisateur"
                          {...register('username')}
                          error={!!errors.username}
                          helperText={errors.username?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Mot de passe"
                          type="password"
                          {...register('password')}
                          error={!!errors.password}
                          helperText={errors.password?.message}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de {estEdition ? 'la modification' : 'la création'} du patient
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
                  if (estEdition && id) {
                    navigate(`/patients/${id}`);
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
export default FormulairePatient;

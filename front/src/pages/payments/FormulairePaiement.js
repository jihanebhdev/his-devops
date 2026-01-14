import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { paiementsService } from '../../api/paiements';
import { facturesService } from '../../api/factures';
import { patientsService } from '../../api/patients';
import { useToast } from '../../hooks/useToast';
const schema = yup.object({
  factureId: yup.number().required('La facture est requise'),
  montant: yup.number().required('Le montant est requis').min(0.01),
  datePaiement: yup.date().required('La date de paiement est requise'),
  modePaiement: yup.string().required('Le mode de paiement est requis'),
  referenceTransaction: yup.string(),
  notes: yup.string(),
});
const FormulairePaiement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [factures, setFactures] = useState([]);
  const [patients, setPatients] = useState([]);
  const { data: facturesData } = useQuery('factures', facturesService.getAll);
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  useEffect(() => {
    if (patientsData) {
      const data = patientsData.data || patientsData;
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }
    }
  }, [patientsData]);
  useEffect(() => {
    if (facturesData) {
      const data = facturesData.data || facturesData;
      if (Array.isArray(data)) {
        const enrichedFactures = data.map((facture) => {
          let enriched = { ...facture };
          if (!facture.patient || typeof facture.patient !== 'object') {
            const patient = patients.find(p => p.id === facture.patientId);
            if (patient) {
              enriched.patient = patient;
            }
          }
          return enriched;
        });
        setFactures(enrichedFactures);
      } else {
        setFactures([]);
      }
    }
  }, [facturesData, patients]);
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
      datePaiement: dayjs(),
      modePaiement: '',
    },
  });
  const factureSelectionnee = factures.find((f) => f.id === watch('factureId'));
  const montantMax = factureSelectionnee?.montantTotal || 0;
  const mutation = useMutation(
    (data) => {
      const donneesSoumission = {
        ...data,
        datePaiement: data.datePaiement ? dayjs(data.datePaiement).format('YYYY-MM-DDTHH:mm:ss') : null,
      };
      console.log('Submitting payment:', donneesSoumission);
      return paiementsService.create(donneesSoumission);
    },
    {
      onSuccess: (response) => {
        console.log('Payment created successfully:', response);
        queryClient.invalidateQueries('paiements');
        queryClient.invalidateQueries('factures');
        showSuccess('Paiement enregistré avec succès');
        navigate('/paiements');
      },
      onError: (error) => {
        console.error('Error creating payment:', error);
        showError(error?.response?.data?.message || 'Erreur lors de l\'enregistrement du paiement');
      },
    }
  );
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Enregistrer un paiement
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={factures || []}
                  getOptionLabel={(option) => {
                    const numero = option.numeroFacture || `FAC-${option.id}`;
                    const patientNom = option.patient?.nom || '';
                    const patientPrenom = option.patient?.prenom || '';
                    const montant = option.montantTotal?.toLocaleString('fr-FR') || '0';
                    const statut = option.statut || 'EN_ATTENTE';
                    return `Facture #${numero} - ${patientPrenom} ${patientNom} - ${montant} MAD (${statut})`;
                  }}
                  value={factureSelectionnee || null}
                  onChange={(event, newValue) => {
                    console.log('Facture selected:', newValue);
                    setValue('factureId', newValue?.id || null);
                    if (newValue?.montantTotal) {
                      setValue('montant', newValue.montantTotal);
                    }
                  }}
                  loading={!facturesData || !patientsData}
                  noOptionsText="Aucune facture disponible"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Facture"
                      required
                      error={!!errors.factureId}
                      helperText={errors.factureId?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(!facturesData || !patientsData) ? <CircularProgress color="inherit" size={20} /> : null}
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
                  type="number"
                  label="Montant (MAD)"
                  required
                  {...register('montant', { valueAsNumber: true })}
                  error={!!errors.montant}
                  helperText={errors.montant?.message || `Maximum: ${montantMax.toLocaleString('fr-FR')} MAD`}
                  inputProps={{ max: montantMax, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="datePaiement"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        label="Date et heure de paiement"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.datePaiement,
                            helperText: errors.datePaiement?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Mode de paiement"
                  required
                  {...register('modePaiement')}
                  error={!!errors.modePaiement}
                  helperText={errors.modePaiement?.message}
                  defaultValue=""
                >
                  <MenuItem value="ESPECES">Espèces</MenuItem>
                  <MenuItem value="CARTE_BANCAIRE">Carte bancaire</MenuItem>
                  <MenuItem value="CHEQUE">Chèque</MenuItem>
                  <MenuItem value="VIREMENT">Virement</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Référence transaction"
                  {...register('referenceTransaction')}
                  error={!!errors.referenceTransaction}
                  helperText={errors.referenceTransaction?.message}
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
            {factureSelectionnee && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Facture sélectionnée: #{factureSelectionnee.numeroFacture || factureSelectionnee.id}
                </Typography>
                <Typography variant="body2">
                  Patient: {factureSelectionnee.patient?.prenom || '-'} {factureSelectionnee.patient?.nom || '-'}
                </Typography>
                <Typography variant="body2">
                  Montant total: {factureSelectionnee.montantTotal?.toLocaleString('fr-FR') || '0'} MAD
                </Typography>
                <Typography variant="body2">
                  Statut: {factureSelectionnee.statut || 'EN_ATTENTE'}
                </Typography>
              </Alert>
            )}
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {mutation.error?.response?.data?.message || 'Erreur lors de l\'enregistrement du paiement'}
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
              <Button variant="outlined" onClick={() => navigate('/paiements')}>
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulairePaiement;

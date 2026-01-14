import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { facturesService } from '../../api/factures';
import { patientsService } from '../../api/patients';
import { assurancesService } from '../../api/assurances';
const schema = yup.object({
  patientId: yup.number().required('Le patient est requis'),
  assuranceId: yup.number().nullable(),
  dateFacturation: yup.date().required('La date de facturation est requise'),
  lignesFacture: yup
    .array()
    .of(
      yup.object({
        description: yup.string().required('La description est requise'),
        quantite: yup.number().required('La quantité est requise').min(1),
        prixUnitaire: yup.number().required('Le prix unitaire est requis').min(0),
      })
    )
    .min(1, 'Au moins une ligne de facture est requise'),
});
const FormulaireFacture = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [patients, setPatients] = useState([]);
  const [assurances, setAssurances] = useState([]);
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dateFacturation: dayjs(),
      lignesFacture: [{ description: '', quantite: 1, prixUnitaire: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lignesFacture',
  });
  useEffect(() => {
    if (patientsData?.data) {
      setPatients(patientsData.data);
    }
  }, [patientsData]);
  const lignesFacture = watch('lignesFacture');
  const montantTotal = lignesFacture.reduce(
    (sum, ligne) => sum + (ligne.quantite || 0) * (ligne.prixUnitaire || 0),
    0
  );
  const mutation = useMutation(
    (data) => {
      const donneesSoumission = {
        ...data,
        dateFacturation: data.dateFacturation ? dayjs(data.dateFacturation).toISOString() : null,
        montantTotal,
      };
      return facturesService.create(donneesSoumission);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('factures');
        navigate('/factures');
      },
    }
  );
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Nouvelle facture
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
                    if (newValue?.id) {
                      assurancesService.getByPatient(newValue.id).then((res) => {
                        setAssurances(res?.data || []);
                      });
                    }
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
                <TextField
                  fullWidth
                  select
                  label="Assurance (optionnel)"
                  {...register('assuranceId')}
                  defaultValue=""
                >
                  <MenuItem value="">Aucune</MenuItem>
                  {assurances.map((assurance) => (
                    <MenuItem key={assurance.id} value={assurance.id}>
                      {assurance.nomAssurance}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date de facturation"
                    value={watch('dateFacturation')}
                    onChange={(date) => setValue('dateFacturation', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateFacturation,
                        helperText: errors.dateFacturation?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                  Lignes de facture
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Quantité</TableCell>
                        <TableCell>Prix unitaire (MAD)</TableCell>
                        <TableCell>Total (MAD)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((field, index) => {
                        const ligne = lignesFacture[index];
                        const totalLigne = (ligne?.quantite || 0) * (ligne?.prixUnitaire || 0);
                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                {...register(`lignesFacture.${index}.description`)}
                                error={!!errors.lignesFacture?.[index]?.description}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                {...register(`lignesFacture.${index}.quantite`, { valueAsNumber: true })}
                                error={!!errors.lignesFacture?.[index]?.quantite}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                {...register(`lignesFacture.${index}.prixUnitaire`, { valueAsNumber: true })}
                                error={!!errors.lignesFacture?.[index]?.prixUnitaire}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {totalLigne.toLocaleString('fr-FR')} MAD
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => append({ description: '', quantite: 1, prixUnitaire: 0 })}
                  sx={{ mt: 2 }}
                >
                  Ajouter une ligne
                </Button>
                {errors.lignesFacture && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {errors.lignesFacture.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Montant total
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {montantTotal.toLocaleString('fr-FR')} MAD
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Erreur lors de la création de la facture
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained" disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/factures')}>
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FormulaireFacture;

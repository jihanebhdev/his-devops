import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ExitToApp as ExitIcon } from '@mui/icons-material';
import { hospitalisationsService } from '../../api/hospitalisations';
import { suivisService } from '../../api/suivis';
import { useAuth } from '../../contexts/AuthContext';
const DetailsHospitalisation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const [dialogueSortie, setDialogueSortie] = React.useState(false);
  const [notesSortie, setNotesSortie] = React.useState('');
  const { data, isLoading } = useQuery(['hospitalisation', id], () =>
    hospitalisationsService.getById(id)
  );
  const { data: suivis } = useQuery(
    ['suivis', id],
    () => suivisService.getByHospitalisation(id),
    { enabled: !!id }
  );
  const mutationSortie = useMutation(
    (notes) => hospitalisationsService.enregistrerSortie(id, notes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hospitalisation', id]);
        queryClient.invalidateQueries('hospitalisations');
        setDialogueSortie(false);
        setNotesSortie('');
      },
    }
  );
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const hospitalisation = data?.data;
  if (!hospitalisation) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Hospitalisation non trouvée
        </Typography>
      </Box>
    );
  }
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const handleEnregistrerSortie = () => {
    mutationSortie.mutate(notesSortie);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/hospitalisations')}>
            Retour
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Détails de l'hospitalisation
          </Typography>
        </Box>
        {hospitalisation.statut === 'EN_COURS' &&
          (hasRole('ADMINISTRATEUR') || hasRole('MEDECIN')) && (
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitIcon />}
              onClick={() => setDialogueSortie(true)}
            >
              Enregistrer la sortie
            </Button>
          )}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Informations générales
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Patient
                  </Typography>
                  <Typography variant="body1">
                    {hospitalisation.patient?.prenom} {hospitalisation.patient?.nom}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Médecin
                  </Typography>
                  <Typography variant="body1">
                    {hospitalisation.medecin?.prenom} {hospitalisation.medecin?.nom}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date d'admission
                  </Typography>
                  <Typography variant="body1">
                    {formaterDate(hospitalisation.dateAdmission)}
                  </Typography>
                </Grid>
                {hospitalisation.dateSortie && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Date de sortie
                    </Typography>
                    <Typography variant="body1">
                      {formaterDate(hospitalisation.dateSortie)}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Lit
                  </Typography>
                  <Typography variant="body1">
                    {hospitalisation.lit?.numeroLit || '-'} - {hospitalisation.lit?.service || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Statut
                  </Typography>
                  <Chip
                    label={hospitalisation.statut}
                    color={hospitalisation.statut === 'EN_COURS' ? 'error' : 'success'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Motif d'admission
                  </Typography>
                  <Typography variant="body1">{hospitalisation.motifAdmission}</Typography>
                </Grid>
                {hospitalisation.diagnostic && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Diagnostic
                    </Typography>
                    <Typography variant="body1">{hospitalisation.diagnostic}</Typography>
                  </Grid>
                )}
                {hospitalisation.notesSortie && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Notes de sortie
                    </Typography>
                    <Typography variant="body1">{hospitalisation.notesSortie}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
          {suivis?.data && suivis.data.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                  Suivis hospitaliers
                </Typography>
                {suivis.data.map((suivi) => (
                  <Box key={suivi.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(suivi.dateHeure).toLocaleString('fr-FR')}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {suivi.observations}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      <Dialog open={dialogueSortie} onClose={() => setDialogueSortie(false)}>
        <DialogTitle>Enregistrer la sortie</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes de sortie"
            value={notesSortie}
            onChange={(e) => setNotesSortie(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogueSortie(false)}>Annuler</Button>
          <Button
            onClick={handleEnregistrerSortie}
            variant="contained"
            color="error"
            disabled={mutationSortie.isLoading}
          >
            {mutationSortie.isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default DetailsHospitalisation;

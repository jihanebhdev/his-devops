import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { hospitalisationsService } from '../../api/hospitalisations';
import { patientsService } from '../../api/patients';
import { utilisateursService } from '../../api/utilisateurs';
import { litsService } from '../../api/lits';
import { useAuth } from '../../contexts/AuthContext';
const ListeHospitalisations = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const { data: hospitalisationsData, isLoading } = useQuery(
    'hospitalisations',
    hospitalisationsService.getAll
  );
  const { data: patientsData } = useQuery('patients', patientsService.getAll);
  const { data: medecinsData } = useQuery('medecins', utilisateursService.getAllDoctors);
  const { data: litsData } = useQuery('lits', litsService.getAll);
  const hospitalisations = Array.isArray(hospitalisationsData?.data) 
    ? hospitalisationsData.data 
    : Array.isArray(hospitalisationsData) 
    ? hospitalisationsData 
    : [];
  const patients = Array.isArray(patientsData?.data) 
    ? patientsData.data 
    : Array.isArray(patientsData) 
    ? patientsData 
    : [];
  const medecins = Array.isArray(medecinsData?.data) 
    ? medecinsData.data 
    : Array.isArray(medecinsData) 
    ? medecinsData 
    : [];
  const lits = Array.isArray(litsData?.data) 
    ? litsData.data 
    : Array.isArray(litsData) 
    ? litsData 
    : [];
  const hospitalisationsEnrichies = hospitalisations.map((hospitalisation) => {
    let enriched = { ...hospitalisation };
    if (!hospitalisation.patient || typeof hospitalisation.patient !== 'object') {
      const patient = patients.find(p => p.id === hospitalisation.patientId);
      if (patient) enriched.patient = patient;
    }
    if (!hospitalisation.medecin || typeof hospitalisation.medecin !== 'object') {
      const medecin = medecins.find(m => m.id === hospitalisation.medecinId);
      if (medecin) enriched.medecin = medecin;
    }
    if (!hospitalisation.lit || typeof hospitalisation.lit !== 'object') {
      const lit = lits.find(l => l.id === hospitalisation.litId);
      if (lit) enriched.lit = lit;
    }
    return enriched;
  });
  console.log('Filter status:', filtreStatut);
  console.log('All hospitalizations:', hospitalisationsEnrichies.map(h => ({ 
    id: h.id, 
    statut: h.statut,
    patient: h.patient?.nom,
    dateAdmission: h.dateAdmission,
    dateSortie: h.dateSortie
  })));
  const hospitalisationsFiltrees = hospitalisationsEnrichies.filter((hosp) => {
    const correspondRecherche =
      recherche === '' ||
      `${hosp.patient?.nom} ${hosp.patient?.prenom}`.toLowerCase().includes(recherche.toLowerCase()) ||
      `${hosp.medecin?.nom} ${hosp.medecin?.prenom}`.toLowerCase().includes(recherche.toLowerCase()) ||
      hosp.motifAdmission?.toLowerCase().includes(recherche.toLowerCase()) ||
      hosp.lit?.numeroLit?.toLowerCase().includes(recherche.toLowerCase()) ||
      hosp.lit?.service?.toLowerCase().includes(recherche.toLowerCase());
    const hospitalStatut = (hosp.statut || '').toUpperCase();
    let correspondStatut = filtreStatut === 'TOUS';
    if (!correspondStatut) {
      if (filtreStatut === 'SORTIE' || filtreStatut === 'SORTI') {
        correspondStatut = hospitalStatut === 'SORTIE' || hospitalStatut === 'SORTI';
      } else {
        correspondStatut = hospitalStatut === filtreStatut;
      }
    }
    return correspondRecherche && correspondStatut;
  });
  console.log('Filtered hospitalizations:', hospitalisationsFiltrees.length);
  console.log('Filtered results:', hospitalisationsFiltrees.map(h => ({ 
    id: h.id, 
    statut: h.statut,
    patient: h.patient?.nom 
  })));
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  const getCouleurStatut = (statut) => {
    const normalizedStatut = (statut || '').toUpperCase();
    if (normalizedStatut === 'EN_COURS') return 'error';
    if (normalizedStatut === 'SORTIE' || normalizedStatut === 'SORTI') return 'success';
    return 'default';
  };
  const getLibelleStatut = (statut) => {
    const normalizedStatut = (statut || '').toUpperCase();
    if (normalizedStatut === 'EN_COURS') return 'En cours';
    if (normalizedStatut === 'SORTIE' || normalizedStatut === 'SORTI') return 'Sorti';
    return statut || '-';
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Liste des hospitalisations</Typography>
        {(hasRole('ADMINISTRATEUR') || hasRole('MEDECIN')) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/hospitalisations/nouvelle')}
          >
            Nouvelle hospitalisation
          </Button>
        )}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher une hospitalisation..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filtreStatut}
                label="Statut"
                onChange={(e) => {
                  console.log('Status filter changed to:', e.target.value);
                  setFiltreStatut(e.target.value);
                }}
              >
                <MenuItem value="TOUS">
                  Tous ({hospitalisationsEnrichies.length})
                </MenuItem>
                <MenuItem value="EN_COURS">
                  En cours ({hospitalisationsEnrichies.filter(h => (h.statut || '').toUpperCase() === 'EN_COURS').length})
                </MenuItem>
                <MenuItem value="SORTIE">
                  Sorti ({hospitalisationsEnrichies.filter(h => {
                    const s = (h.statut || '').toUpperCase();
                    return s === 'SORTIE' || s === 'SORTI';
                  }).length})
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Médecin</TableCell>
                    <TableCell>Date d'admission</TableCell>
                    <TableCell>Lit</TableCell>
                    <TableCell>Motif</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hospitalisationsFiltrees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 4 }}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Aucune hospitalisation trouvée
                          </Typography>
                          {filtreStatut !== 'TOUS' && (
                            <Typography variant="caption" color="textSecondary">
                              Essayez de changer le filtre de statut ou la recherche
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    hospitalisationsFiltrees.map((hospitalisation) => (
                      <TableRow key={hospitalisation.id} hover>
                        <TableCell>
                          {hospitalisation.patient ? 
                            `${hospitalisation.patient.prenom || ''} ${hospitalisation.patient.nom || ''}`.trim() 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {hospitalisation.medecin ? 
                            `Dr. ${hospitalisation.medecin.prenom || ''} ${hospitalisation.medecin.nom || ''}`.trim() 
                            : '-'}
                        </TableCell>
                        <TableCell>{formaterDate(hospitalisation.dateAdmission)}</TableCell>
                        <TableCell>
                          {hospitalisation.lit ? 
                            `${hospitalisation.lit.numeroLit} - ${hospitalisation.lit.service}` 
                            : '-'}
                        </TableCell>
                        <TableCell>{hospitalisation.motifAdmission || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={getLibelleStatut(hospitalisation.statut)}
                            color={getCouleurStatut(hospitalisation.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/hospitalisations/${hospitalisation.id}`)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default ListeHospitalisations;

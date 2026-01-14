import React from 'react';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button, Chip,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { facturesService } from '../../api/factures';
import { paiementsService } from '../../api/paiements';
import CarteStatistique from '../../components/shared/CarteStatistique';
const DashboardComptabilite = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { data: factures, isLoading: facturesLoading } = useQuery(
    'allBills',
    () => facturesService.getByPatient(1).catch(() => ({ data: [] }))
  );
  const { data: paiements, isLoading: paiementsLoading } = useQuery(
    'allPayments',
    () => paiementsService.getByPatient(1).catch(() => ({ data: [] }))
  );
  if (facturesLoading || paiementsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const nombreFactures = factures?.data?.length || 0;
  const nombrePaiements = paiements?.data?.length || 0;
  const montantTotal = factures?.data?.reduce((sum, f) => sum + (f.montantTotal || 0), 0) || 0;
  const montantPaye = paiements?.data?.reduce((sum, p) => sum + (p.montant || 0), 0) || 0;
  const soldeImpaye = montantTotal - montantPaye;
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tableau de bord - Comptabilité
      </Typography>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Factures en attente"
            valeur={nombreFactures}
            icone={<ReceiptIcon />}
            couleur="warning"
            variation="En attente"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Paiements reçus"
            valeur={nombrePaiements}
            icone={<PaymentIcon />}
            couleur="success"
            variation="+15%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Revenus totaux"
            valeur={`${(montantTotal / 1000).toFixed(0)}k`}
            icone={<BalanceIcon />}
            couleur="primary"
            variation="+22%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CarteStatistique
            titre="Solde impayé"
            valeur={`${(soldeImpaye / 1000).toFixed(0)}k`}
            icone={<ReceiptIcon />}
            couleur="error"
            variation="-5%"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: isDark ? '#0c1017' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Actions rapides
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ReceiptIcon />}
                    onClick={() => navigate('/factures')}
                    sx={{ mr: 1 }}
                  >
                    Factures
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PaymentIcon />}
                    onClick={() => navigate('/paiements')}
                  >
                    Paiements
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardComptabilite;

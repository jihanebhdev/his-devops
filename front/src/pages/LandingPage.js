import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import {
  LocalHospital,
  People,
  CalendarToday,
  MedicalServices,
  Security,
  Speed,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const features = [
    {
      icon: <People />,
      title: 'Gestion des Patients',
      description: 'Gérez efficacement les dossiers médicaux et les informations des patients.',
    },
    {
      icon: <CalendarToday />,
      title: 'Rendez-vous en Ligne',
      description: 'Planifiez et gérez les rendez-vous médicaux en toute simplicité.',
    },
    {
      icon: <MedicalServices />,
      title: 'Consultations',
      description: 'Suivez les consultations et les prescriptions médicales.',
    },
    {
      icon: <Security />,
      title: 'Sécurité des Données',
      description: 'Protection avancée des données médicales sensibles.',
    },
    {
      icon: <Speed />,
      title: 'Performance',
      description: 'Interface rapide et intuitive pour une meilleure productivité.',
    },
    {
      icon: <CheckCircle />,
      title: 'Fiabilité',
      description: 'Système fiable et testé pour une utilisation professionnelle.',
    },
  ];
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#05070a' : '#ffffff',
        color: isDark ? '#ffffff' : '#1a1a1a',
      }}
    >
      {}
      <Box
        sx={{
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: isDark ? '#05070a' : '#ffffff',
          py: 2,
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalHospital sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Système Hospitalier
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: 3,
                  boxShadow: 'none',
                }}
              >
                Connexion
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      {}
      <Container sx={{ py: { xs: 6, md: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.2,
              }}
            >
              Gestion Hospitalière
              <br />
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                Moderne et Efficace
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                lineHeight: 1.8,
              }}
            >
              Une solution complète pour la gestion des patients, des rendez-vous, des consultations
              et de tous les aspects administratifs d'un établissement de santé.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 4,
                  boxShadow: 'none',
                  backgroundColor: isDark
                    ? 'rgba(25, 118, 210, 0.15)'
                    : 'rgba(25, 118, 210, 0.08)',
                  color: isDark ? '#42a5f5' : '#1976d2',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(25, 118, 210, 0.2)'
                      : 'rgba(25, 118, 210, 0.12)',
                    boxShadow: 'none',
                  },
                }}
              >
                Commencer
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 4,
                  boxShadow: 'none',
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.12)'
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                    border: isDark
                      ? '1px solid rgba(255, 255, 255, 0.12)'
                      : '1px solid rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                En savoir plus
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: { xs: 300, md: 500 },
              }}
            >
              <LocalHospital
                sx={{
                  fontSize: { xs: 200, md: 400 },
                  opacity: 0.1,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      {}
      <Box
        sx={{
          backgroundColor: isDark ? '#0c1017' : '#f5f5f5',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container>
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Fonctionnalités Principales
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 6,
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Découvrez les fonctionnalités qui font de notre système la solution idéale pour votre
            établissement de santé.
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: isDark ? '#05070a' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: 4,
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        fontSize: 48,
                        color: theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Card
          sx={{
            backgroundColor: isDark ? '#0c1017' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: 4,
            boxShadow: 'none',
            p: { xs: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Prêt à commencer ?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            Connectez-vous pour accéder à votre espace personnel et commencer à utiliser le système.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              px: 4,
              boxShadow: 'none',
              backgroundColor: isDark
                ? 'rgba(25, 118, 210, 0.15)'
                : 'rgba(25, 118, 210, 0.08)',
              color: isDark ? '#42a5f5' : '#1976d2',
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(25, 118, 210, 0.2)'
                  : 'rgba(25, 118, 210, 0.12)',
                boxShadow: 'none',
              },
            }}
          >
            Se connecter
          </Button>
        </Card>
      </Container>
      {}
      <Box
        sx={{
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: isDark ? '#05070a' : '#ffffff',
          py: 4,
        }}
      >
        <Container>
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            }}
          >
            © 2024 Système Hospitalier. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
export default LandingPage;

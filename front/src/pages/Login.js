import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  LocalHospital,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_ROUTES } from '../config/api';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const from = location.state?.from?.pathname || null;
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData?.roles && userData.roles.length > 0) {
            const firstRole = userData.roles[0];
            const route = ROLE_ROUTES[firstRole] || '/';
            navigate(route, { replace: true });
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success && result.user) {
        enqueueSnackbar('Connexion réussie', { variant: 'success' });
        const roles = result.user.roles || [];
        let redirectTo = from;
        if (!redirectTo && roles.length > 0) {
          const firstRole = roles[0];
          redirectTo = ROLE_ROUTES[firstRole] || '/';
        } else if (!redirectTo) {
          redirectTo = '/';
        }
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 100);
      } else {
        const errorMessage = result.error || 'Nom d\'utilisateur ou mot de passe incorrect';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? '#05070a' : '#ffffff',
        backgroundImage: isDark 
          ? 'linear-gradient(135deg, #05070a 0%, #0c1017 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card
          sx={{
            width: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <LocalHospital sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Système Hospitalier
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connectez-vous à votre compte
              </Typography>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nom d'utilisateur"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                startIcon={<LoginIcon />}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
export default Login;

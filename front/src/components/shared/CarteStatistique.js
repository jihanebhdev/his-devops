import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
const CarteStatistique = ({ titre, valeur, icone, couleur = 'primary', variation = null, tendance = null, sousTitre = null }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colorMap = {
    primary: { main: '#1976d2', dark: '#1565c0', light: '#42a5f5' },
    success: { main: '#2e7d32', dark: '#1b5e20', light: '#4caf50' },
    warning: { main: '#ed6c02', dark: '#e65100', light: '#ff9800' },
    info: { main: '#0288d1', dark: '#01579b', light: '#03a9f4' },
    error: { main: '#d32f2f', dark: '#c62828', light: '#ef5350' },
  };
  const colors = colorMap[couleur] || colorMap.primary;
  const isPositive = variation && variation.startsWith('+');
  const isNegative = variation && variation.startsWith('-');
  const miniData = tendance && tendance.length > 0 ? tendance : [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ];
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: isDark ? '#0c1017' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
        boxShadow: 'none',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                mb: 1,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {titre}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#1a1a1a',
                mb: 0.5,
              }}
            >
              {valeur}
            </Typography>
            {sousTitre && (
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {sousTitre}
              </Typography>
            )}
            {variation && (
              <Chip
                variant="outlined"
                icon={isPositive ? <TrendingUpIcon /> : isNegative ? <TrendingDownIcon /> : null}
                label={variation}
                size="small"
                color={couleur}
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    fontSize: '1rem',
                  },
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              fontSize: 40,
              opacity: 0.1,
              color: colors.main,
            }}
          >
            {icone}
          </Box>
        </Box>
        <Box sx={{ height: 60, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={miniData}>
              <defs>
                <linearGradient id={`gradient-${couleur}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.main} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.main}
                strokeWidth={2}
                fill={`url(#gradient-${couleur})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            mt: 1,
            display: 'block',
          }}
        >
          Last 30 days
        </Typography>
      </CardContent>
    </Card>
  );
};
export default CarteStatistique;

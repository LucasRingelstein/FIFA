import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StatCard from '../components/StatCard';

function DashboardPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Jugadores" value="-" helper="Pendiente de conectar a API" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Partidos importados" value="-" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Top jugador" value="-" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Categoría activa" value="Mayor" />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DashboardPage;

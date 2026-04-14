import { useEffect, useState } from 'react';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StatCard from '../components/StatCard';
import Mejor11Pitch from '../components/Mejor11Pitch';
import { getMejor11 } from '../api/rankings';
import type { CategoriaPlantel } from '../types/importaciones';
import type { Mejor11Item } from '../types/rankings';

function DashboardPage() {
  const [categoria, setCategoria] = useState<CategoriaPlantel>('Mayor');
  const [mejor11, setMejor11] = useState<Mejor11Item[]>([]);

  useEffect(() => {
    getMejor11(categoria).then(setMejor11).catch(() => setMejor11([]));
  }, [categoria]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Dashboard
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Typography variant="h6">Mejor 11 visual</Typography>
        <TextField
          select
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaPlantel)}
          sx={{ width: 220 }}
        >
          <MenuItem value="Mayor">Mayor</MenuItem>
          <MenuItem value="Juvenil">Juvenil</MenuItem>
        </TextField>
      </Stack>

      <Mejor11Pitch players={mejor11} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Jugadores" value="-" helper="Pendiente de conectar a API" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Partidos importados" value="-" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Top jugador" value={mejor11[0]?.jugador ?? '-'} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Categoría activa" value={categoria} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DashboardPage;

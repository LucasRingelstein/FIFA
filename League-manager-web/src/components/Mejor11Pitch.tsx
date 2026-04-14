import { Card, CardContent, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { Mejor11Item } from '../types/rankings';

interface Mejor11PitchProps {
  players: Mejor11Item[];
}

function Mejor11Pitch({ players }: Mejor11PitchProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mejor 11 (vista simple)
        </Typography>
        <Grid container spacing={1}>
          {players.map((player, idx) => (
            <Grid key={`${player.jugadorId}-${idx}`} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 1.5 }}>
                <Typography fontWeight={600}>{player.jugador}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {player.posicion} · {player.valor.toFixed(2)} pts
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Mejor11Pitch;

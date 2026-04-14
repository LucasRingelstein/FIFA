import { useMemo } from 'react';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import type { Mejor11Item } from '../types/rankings';

interface Mejor11PitchProps {
  players: Mejor11Item[];
}

type Slot = {
  key: string;
  label: string;
  top: string;
  left: string;
  roles: string[];
};

const SLOTS: Slot[] = [
  { key: 'gk', label: 'POR', top: '88%', left: '50%', roles: ['POR', 'ARQ', 'GK'] },

  { key: 'lb', label: 'LI', top: '70%', left: '18%', roles: ['LI', 'LWB', 'DEF'] },
  { key: 'cb1', label: 'DFC', top: '72%', left: '38%', roles: ['DFC', 'CB', 'LIB', 'DEF'] },
  { key: 'cb2', label: 'DFC', top: '72%', left: '62%', roles: ['DFC', 'CB', 'LIB', 'DEF'] },
  { key: 'rb', label: 'LD', top: '70%', left: '82%', roles: ['LD', 'RWB', 'DEF'] },

  { key: 'cdm', label: 'MCD', top: '56%', left: '50%', roles: ['MCD', 'MC', 'MED'] },
  { key: 'cm1', label: 'MC', top: '45%', left: '32%', roles: ['MC', 'MI', 'MED', 'MCO'] },
  { key: 'cm2', label: 'MC', top: '45%', left: '68%', roles: ['MC', 'MD', 'MED', 'MCO'] },

  { key: 'lw', label: 'EI', top: '24%', left: '24%', roles: ['EI', 'DEL', 'SD'] },
  { key: 'st', label: 'DC', top: '16%', left: '50%', roles: ['DC', 'DEL', 'ST'] },
  { key: 'rw', label: 'ED', top: '24%', left: '76%', roles: ['ED', 'DEL', 'SD'] }
];

function norm(value: string): string {
  return value.trim().toUpperCase();
}

function buildLineup(players: Mejor11Item[]): Array<{ slot: Slot; player?: Mejor11Item }> {
  const ordered = [...players].sort((a, b) => b.valor - a.valor);
  const used = new Set<number>();

  const assigned = SLOTS.map((slot) => {
    const index = ordered.findIndex((player, idx) => {
      if (used.has(idx)) return false;
      const pos = norm(player.posicion);
      return slot.roles.some((role) => pos.includes(role));
    });

    if (index >= 0) {
      used.add(index);
      return { slot, player: ordered[index] };
    }

    return { slot, player: undefined };
  });

  const leftovers = ordered.filter((_, idx) => !used.has(idx));
  let pointer = 0;

  return assigned.map((item) => {
    if (item.player || pointer >= leftovers.length) return item;
    const player = leftovers[pointer];
    pointer += 1;
    return { ...item, player };
  });
}

function Mejor11Pitch({ players }: Mejor11PitchProps) {
  const lineup = useMemo(() => buildLineup(players), [players]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mejor 11 · Vista de cancha
        </Typography>

        <Box
          sx={{
            position: 'relative',
            height: { xs: 520, md: 620 },
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #2e7d32 0%, #1b5e20 100%)',
            border: '4px solid #ffffff'
          }}
        >
          <Box sx={{ position: 'absolute', inset: '50% auto auto 0', width: '100%', borderTop: '3px solid #ffffff99' }} />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: '3px solid #ffffff99'
            }}
          />

          {lineup.map(({ slot, player }) => (
            <Box
              key={slot.key}
              sx={{
                position: 'absolute',
                top: slot.top,
                left: slot.left,
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  px: 1.2,
                  py: 0.8,
                  minWidth: 88,
                  borderRadius: 2,
                  backgroundColor: player ? '#0d47a1' : '#263238aa',
                  color: 'white',
                  border: '2px solid #ffffffaa'
                }}
              >
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.85 }}>
                  {slot.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {player?.jugador ?? '---'}
                </Typography>
                <Typography variant="caption">{player ? `${player.valor.toFixed(2)} pts` : 'vacante'}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip color="primary" label={`Asignados: ${Math.min(players.length, 11)}/11`} />
          <Chip variant="outlined" label="Formación base: 4-3-3" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default Mejor11Pitch;

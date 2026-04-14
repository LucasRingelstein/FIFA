import { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getJugadores } from '../api/jugadores';
import type { JugadorListItem } from '../types/jugadores';

type LineaPrincipal = 'POR' | 'DEF' | 'MED' | 'DEL' | 'OTROS';

const DEF_SUB = ['LD', 'LI', 'DFC', 'LIB', 'CAR'];
const MED_SUB = ['MCD', 'MC', 'MI', 'MD', 'MCO'];
const DEL_SUB = ['EI', 'ED', 'SD', 'DC'];

function normalizePos(pos?: string): string {
  return (pos ?? '').trim().toUpperCase();
}

function getLinea(pos?: string): LineaPrincipal {
  const p = normalizePos(pos);
  if (p.startsWith('POR') || p === 'ARQ' || p === 'GK') return 'POR';
  if (p.startsWith('DEF') || DEF_SUB.includes(p)) return 'DEF';
  if (p.startsWith('MED') || MED_SUB.includes(p)) return 'MED';
  if (p.startsWith('DEL') || DEL_SUB.includes(p)) return 'DEL';
  return 'OTROS';
}

function getSubLinea(pos?: string): string {
  const p = normalizePos(pos);
  if (!p) return 'Sin definir';

  if (DEF_SUB.includes(p) || MED_SUB.includes(p) || DEL_SUB.includes(p)) return p;
  if (p.startsWith('POR') || p === 'ARQ' || p === 'GK') return 'POR';
  if (p.startsWith('DEF')) return 'DEF';
  if (p.startsWith('MED')) return 'MED';
  if (p.startsWith('DEL')) return 'DEL';

  return p;
}

function JugadoresPage() {
  const [jugadores, setJugadores] = useState<JugadorListItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<'Todos' | 'Mayor' | 'Juvenil'>('Todos');

  useEffect(() => {
    getJugadores().then(setJugadores).catch(() => setJugadores([]));
  }, []);

  const filtered = useMemo(
    () =>
      jugadores.filter((item) => {
        const matchText = item.nombre.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoria === 'Todos' || item.categoriaBase === categoria;
        return matchText && matchCategory;
      }),
    [categoria, jugadores, search]
  );

  const grouped = useMemo(() => {
    const lines: Record<LineaPrincipal, Record<string, JugadorListItem[]>> = {
      POR: {},
      DEF: {},
      MED: {},
      DEL: {},
      OTROS: {}
    };

    for (const player of filtered) {
      const line = getLinea(player.posicionPreferida);
      const sub = getSubLinea(player.posicionPreferida);

      if (!lines[line][sub]) {
        lines[line][sub] = [];
      }

      lines[line][sub].push(player);
    }

    return lines;
  }, [filtered]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Jugadores
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField label="Buscar jugador" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />
        <TextField
          select
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as 'Todos' | 'Mayor' | 'Juvenil')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Mayor">Mayor</MenuItem>
          <MenuItem value="Juvenil">Juvenil</MenuItem>
        </TextField>
      </Stack>

      {(['POR', 'DEF', 'MED', 'DEL', 'OTROS'] as LineaPrincipal[]).map((line) => {
        const subdivisions = grouped[line];
        const subdivisionKeys = Object.keys(subdivisions).sort();
        const total = subdivisionKeys.reduce((acc, sub) => acc + subdivisions[sub].length, 0);

        return (
          <Accordion key={line} defaultExpanded={line !== 'OTROS'}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={700}>{line}</Typography>
                <Chip size="small" label={`${total} jugadores`} />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {subdivisionKeys.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sin jugadores en esta línea.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {subdivisionKeys.map((sub) => (
                    <TableContainer component={Paper} key={`${line}-${sub}`}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell colSpan={4} sx={{ fontWeight: 700 }}>
                              {line} / {sub}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Posición</TableCell>
                            <TableCell>Estado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subdivisions[sub].map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.nombre}</TableCell>
                              <TableCell>{item.categoriaBase}</TableCell>
                              <TableCell>{item.posicionPreferida ?? '-'}</TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  color={item.activo ? 'success' : 'default'}
                                  label={item.activo ? 'Activo' : 'Inactivo'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ))}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}

export default JugadoresPage;

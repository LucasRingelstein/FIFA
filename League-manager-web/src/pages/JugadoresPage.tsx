import { useEffect, useMemo, useState } from 'react';
import {
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
import { getJugadores } from '../api/jugadores';
import type { JugadorListItem } from '../types/jugadores';

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Posición</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.categoriaBase}</TableCell>
                <TableCell>{item.posicionPreferida ?? '-'}</TableCell>
                <TableCell>
                  <Chip size="small" color={item.activo ? 'success' : 'default'} label={item.activo ? 'Activo' : 'Inactivo'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default JugadoresPage;

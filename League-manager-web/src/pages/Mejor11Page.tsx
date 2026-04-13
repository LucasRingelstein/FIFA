import { useEffect, useState } from 'react';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import Mejor11Pitch from '../components/Mejor11Pitch';
import { getMejor11 } from '../api/rankings';
import type { CategoriaPlantel } from '../types/importaciones';
import type { Mejor11Item } from '../types/rankings';

function Mejor11Page() {
  const [categoria, setCategoria] = useState<CategoriaPlantel>('Mayor');
  const [items, setItems] = useState<Mejor11Item[]>([]);

  useEffect(() => {
    getMejor11(categoria).then(setItems).catch(() => setItems([]));
  }, [categoria]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Mejor 11
      </Typography>

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

      <Mejor11Pitch players={items} />
    </Stack>
  );
}

export default Mejor11Page;

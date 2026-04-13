import { useEffect, useState } from 'react';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getPartidos, type PartidoListItem } from '../api/partidos';

function PartidosPage() {
  const [items, setItems] = useState<PartidoListItem[]>([]);

  useEffect(() => {
    getPartidos().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Partidos Importados
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Rival</TableCell>
              <TableCell>Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fechaPartido}</TableCell>
                <TableCell>{item.rival}</TableCell>
                <TableCell>{item.categoriaPlantel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default PartidosPage;

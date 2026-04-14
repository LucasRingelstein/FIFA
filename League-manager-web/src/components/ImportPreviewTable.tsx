import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { ImportPreviewRow } from '../types/importaciones';

interface ImportPreviewTableProps {
  rows: ImportPreviewRow[];
}

function ImportPreviewTable({ rows }: ImportPreviewTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Jugador</TableCell>
            <TableCell>Posición</TableCell>
            <TableCell>Valoración</TableCell>
            <TableCell>Goles</TableCell>
            <TableCell>Asistencias</TableCell>
            <TableCell>Suplente</TableCell>
            <TableCell>Jugó</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rowNumber}>
              <TableCell>{row.rowNumber}</TableCell>
              <TableCell>{row.jugador}</TableCell>
              <TableCell>{row.posicion ?? '-'}</TableCell>
              <TableCell>{row.valoracion ?? '-'}</TableCell>
              <TableCell>{row.goles}</TableCell>
              <TableCell>{row.asistencias}</TableCell>
              <TableCell>
                <Chip size="small" label={row.esSuplente ? 'Sí' : 'No'} color={row.esSuplente ? 'warning' : 'default'} />
              </TableCell>
              <TableCell>
                <Chip size="small" label={row.jugo ? 'Sí' : 'No'} color={row.jugo ? 'success' : 'default'} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ImportPreviewTable;

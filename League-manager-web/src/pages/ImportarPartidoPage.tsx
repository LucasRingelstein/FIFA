import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import FileUploadCard from '../components/FileUploadCard';
import ImportPreviewTable from '../components/ImportPreviewTable';
import { previewImportacion } from '../api/importaciones';
import type { CategoriaPlantel, ImportPreviewResponse } from '../types/importaciones';

type ImportMode = 'excel' | 'manual';

interface ManualRow {
  id: string;
  jugador: string;
  posicion: string;
  valoracion: string;
  goles: string;
  asistencias: string;
  esSuplente: boolean;
  jugo: boolean;
}

const createManualRow = (): ManualRow => ({
  id: crypto.randomUUID(),
  jugador: '',
  posicion: '',
  valoracion: '',
  goles: '0',
  asistencias: '0',
  esSuplente: false,
  jugo: true
});

function ImportarPartidoPage() {
  const [mode, setMode] = useState<ImportMode>('excel');
  const [categoria, setCategoria] = useState<CategoriaPlantel>('Mayor');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState<ImportPreviewResponse>();

  const [manualRows, setManualRows] = useState<ManualRow[]>([createManualRow()]);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await previewImportacion(file);
      setPreview(response);
      if (response.categoriaDetectada) {
        setCategoria(response.categoriaDetectada);
      }
    } catch {
      setError('No se pudo procesar el archivo. Revisá que la API esté levantada y el Excel sea válido.');
    } finally {
      setLoading(false);
    }
  };

  const manualValidRows = useMemo(() => manualRows.filter((x) => x.jugador.trim().length > 0), [manualRows]);

  const updateManualRow = (id: string, patch: Partial<ManualRow>) => {
    setManualRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const deleteManualRow = (id: string) => {
    setManualRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Importar Partido
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Modo de carga</InputLabel>
            <Select value={mode} label="Modo de carga" onChange={(e) => setMode(e.target.value as ImportMode)}>
              <MenuItem value="excel">Desde Excel</MenuItem>
              <MenuItem value="manual">Carga manual total</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoria}
              label="Categoría"
              onChange={(e) => setCategoria(e.target.value as CategoriaPlantel)}
            >
              <MenuItem value="Mayor">Mayor</MenuItem>
              <MenuItem value="Juvenil">Juvenil</MenuItem>
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ mb: 0 }}>
            La importación se procesa para categoría <strong>{categoria}</strong>.
          </Alert>
        </Stack>
      </Paper>

      {mode === 'excel' ? (
        <>
          <FileUploadCard
            loading={loading}
            selectedFileName={preview?.nombreArchivo}
            error={error}
            onFileSelected={handleFile}
          />

          {loading ? <CircularProgress /> : null}

          {preview ? (
            <Stack spacing={2}>
              <Alert severity={preview.errores.length > 0 ? 'error' : 'success'}>
                Filas válidas: {preview.filasValidas} / {preview.filasLeidas}. Categoría detectada en archivo:{' '}
                {preview.categoriaDetectada ?? 'N/A'}
              </Alert>

              {preview.advertencias.map((warning) => (
                <Alert key={warning} severity="warning">
                  {warning}
                </Alert>
              ))}

              <Button variant="contained" disabled>
                Confirmar importación (siguiente paso backend)
              </Button>

              <Divider />
              <ImportPreviewTable rows={preview.filas} />
            </Stack>
          ) : null}
        </>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Carga manual total</Typography>
            <Typography variant="body2" color="text.secondary">
              Completá jugadores y rendimiento sin Excel. Esto prepara la data para luego guardarla con el endpoint final.
            </Typography>

            {manualRows.map((row) => (
              <Stack key={row.id} direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <TextField
                  label="Jugador"
                  value={row.jugador}
                  onChange={(e) => updateManualRow(row.id, { jugador: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Posición"
                  value={row.posicion}
                  onChange={(e) => updateManualRow(row.id, { posicion: e.target.value })}
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  label="Val"
                  value={row.valoracion}
                  onChange={(e) => updateManualRow(row.id, { valoracion: e.target.value })}
                  sx={{ width: 90 }}
                />
                <TextField
                  label="G"
                  value={row.goles}
                  onChange={(e) => updateManualRow(row.id, { goles: e.target.value })}
                  sx={{ width: 90 }}
                />
                <TextField
                  label="A"
                  value={row.asistencias}
                  onChange={(e) => updateManualRow(row.id, { asistencias: e.target.value })}
                  sx={{ width: 90 }}
                />
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="caption">Supl.</Typography>
                  <Switch
                    checked={row.esSuplente}
                    onChange={(e) => updateManualRow(row.id, { esSuplente: e.target.checked })}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="caption">Jugó</Typography>
                  <Switch checked={row.jugo} onChange={(e) => updateManualRow(row.id, { jugo: e.target.checked })} />
                </Stack>
                <Button color="error" onClick={() => deleteManualRow(row.id)}>
                  Quitar
                </Button>
              </Stack>
            ))}

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setManualRows((prev) => [...prev, createManualRow()])}>
                Agregar jugador
              </Button>
              <Button variant="contained" disabled={manualValidRows.length === 0}>
                Guardar carga manual (siguiente paso backend)
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

export default ImportarPartidoPage;

import { useState } from 'react';
import { Alert, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import FileUploadCard from '../components/FileUploadCard';
import ImportPreviewTable from '../components/ImportPreviewTable';
import { previewImportacion } from '../api/importaciones';
import type { ImportPreviewResponse } from '../types/importaciones';

function ImportarPartidoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState<ImportPreviewResponse>();
  const [manualFecha, setManualFecha] = useState('');
  const [manualRival, setManualRival] = useState('');

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await previewImportacion(file);
      setPreview(response);
      setManualFecha(response.fechaPartido ?? '');
      setManualRival(response.rival ?? '');
    } catch {
      setError('No se pudo procesar el archivo. Revisá que la API esté levantada y el Excel sea válido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Importar Partido
      </Typography>

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
            Filas válidas: {preview.filasValidas} / {preview.filasLeidas}. Categoría detectada: {preview.categoriaDetectada ?? 'N/A'}
          </Alert>

          {preview.advertencias.map((warning) => (
            <Alert key={warning} severity="warning">
              {warning}
            </Alert>
          ))}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Fecha partido"
              type="date"
              value={manualFecha}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setManualFecha(e.target.value)}
              fullWidth
            />
            <TextField label="Rival" value={manualRival} onChange={(e) => setManualRival(e.target.value)} fullWidth />
          </Stack>

          <Button variant="contained" disabled>
            Confirmar importación (siguiente paso)
          </Button>

          <Divider />
          <ImportPreviewTable rows={preview.filas} />
        </Stack>
      ) : null}
    </Stack>
  );
}

export default ImportarPartidoPage;

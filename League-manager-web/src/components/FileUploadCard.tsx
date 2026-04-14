import { ChangeEvent } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';

interface FileUploadCardProps {
  loading?: boolean;
  selectedFileName?: string;
  error?: string;
  onFileSelected: (file: File) => void;
}

function FileUploadCard({ loading, selectedFileName, error, onFileSelected }: FileUploadCardProps) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Subir Excel del partido</Typography>
          <Typography variant="body2" color="text.secondary">
            Hoja esperada: <strong>ImportPartido</strong>.
          </Typography>

          <Box>
            <Button component="label" variant="contained" disabled={loading}>
              Seleccionar .xlsx
              <input hidden type="file" accept=".xlsx" onChange={onChange} />
            </Button>
          </Box>

          {selectedFileName ? <Alert severity="info">Archivo: {selectedFileName}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FileUploadCard;

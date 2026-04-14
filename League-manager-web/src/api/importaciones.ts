import { http } from './http';
import type { ConfirmImportRequest, ConfirmImportResponse, ImportPreviewResponse } from '../types/importaciones';

export async function previewImportacion(archivo: File): Promise<ImportPreviewResponse> {
  const formData = new FormData();
  formData.append('archivo', archivo);

  const { data } = await http.post<ImportPreviewResponse>('/importaciones/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data;
}

export async function confirmarImportacion(payload: ConfirmImportRequest): Promise<ConfirmImportResponse> {
  const { data } = await http.post<ConfirmImportResponse>('/importaciones/confirmar', payload);
  return data;
}

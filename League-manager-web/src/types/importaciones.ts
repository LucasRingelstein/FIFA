export type CategoriaPlantel = 'Mayor' | 'Juvenil';

export interface ImportPreviewRow {
  rowNumber: number;
  jugador: string;
  jugadorNormalizado: string;
  posicion?: string;
  valoracion?: number;
  goles: number;
  asistencias: number;
  esSuplente: boolean;
  jugo: boolean;
  categoriaPlantel: CategoriaPlantel;
}

export interface ImportPreviewResponse {
  nombreArchivo: string;
  hojaLeida: string;
  fechaPartido?: string;
  rival?: string;
  categoriaDetectada?: CategoriaPlantel;
  filasLeidas: number;
  filasValidas: number;
  errores: string[];
  advertencias: string[];
  filas: ImportPreviewRow[];
}

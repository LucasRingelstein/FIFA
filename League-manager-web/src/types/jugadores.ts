import type { CategoriaPlantel } from './importaciones';

export interface JugadorListItem {
  id: number;
  nombre: string;
  categoriaBase: CategoriaPlantel;
  posicionPreferida?: string;
  activo: boolean;
}

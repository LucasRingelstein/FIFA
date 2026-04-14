import { http } from './http';

export interface PartidoListItem {
  id: number;
  fechaPartido: string;
  rival: string;
  categoriaPlantel: string;
}

export async function getPartidos(): Promise<PartidoListItem[]> {
  const { data } = await http.get<PartidoListItem[]>('/partidos');
  return data;
}

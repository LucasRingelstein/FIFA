import { http } from './http';
import type { JugadorListItem } from '../types/jugadores';

export async function getJugadores(): Promise<JugadorListItem[]> {
  const { data } = await http.get<JugadorListItem[]>('/jugadores');
  return data;
}

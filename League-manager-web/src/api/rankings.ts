import { http } from './http';
import type { Mejor11Item, RankingItem } from '../types/rankings';
import type { CategoriaPlantel } from '../types/importaciones';

export async function getRankingGeneral(categoria: CategoriaPlantel): Promise<RankingItem[]> {
  const { data } = await http.get<{ items: RankingItem[] }>('/rankings/general', { params: { categoria } });
  return data.items ?? [];
}

export async function getMejor11(categoria: CategoriaPlantel): Promise<Mejor11Item[]> {
  const { data } = await http.get<{ items: Mejor11Item[] }>('/rankings/mejor11', { params: { categoria } });
  return data.items ?? [];
}

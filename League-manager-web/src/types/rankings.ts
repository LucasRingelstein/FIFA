export interface RankingItem {
  jugadorId: number;
  jugador: string;
  partidos: number;
  puntosTotales: number;
  promedio: number;
}

export interface Mejor11Item {
  jugadorId: number;
  jugador: string;
  posicion: string;
  valor: number;
}

namespace LeagueManager.Api.DTOs.Rankings;

public class RankingGeneralItemDto
{
    public int JugadorId { get; set; }
    public string Jugador { get; set; } = string.Empty;
    public int Partidos { get; set; }
    public decimal PuntosTotales { get; set; }
    public decimal Promedio { get; set; }
}

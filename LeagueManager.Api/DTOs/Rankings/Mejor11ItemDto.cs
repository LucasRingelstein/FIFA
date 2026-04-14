namespace LeagueManager.Api.DTOs.Rankings;

public class Mejor11ItemDto
{
    public int JugadorId { get; set; }
    public string Jugador { get; set; } = string.Empty;
    public string Posicion { get; set; } = "N/A";
    public decimal Valor { get; set; }
}

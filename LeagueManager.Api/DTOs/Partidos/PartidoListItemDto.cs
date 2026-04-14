using LeagueManager.Api.Enums;

namespace LeagueManager.Api.DTOs.Partidos;

public class PartidoListItemDto
{
    public int Id { get; set; }
    public DateOnly FechaPartido { get; set; }
    public CategoriaPlantel CategoriaPlantel { get; set; }
    public string Rival { get; set; } = string.Empty;
}

using LeagueManager.Api.Enums;

namespace LeagueManager.Api.Models;

public class Partido : BaseEntity
{
    public DateOnly FechaPartido { get; set; }
    public CategoriaPlantel CategoriaPlantel { get; set; }
    public string Rival { get; set; } = string.Empty;
    public string ArchivoOriginal { get; set; } = string.Empty;
    public DateTime FechaImportacion { get; set; } = DateTime.UtcNow;

    public ICollection<RendimientoJugador> Rendimientos { get; set; } = new List<RendimientoJugador>();
}

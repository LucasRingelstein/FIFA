using LeagueManager.Api.Enums;

namespace LeagueManager.Api.Models;

public class Jugador : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;
    public string NombreNormalizado { get; set; } = string.Empty;
    public CategoriaPlantel CategoriaBase { get; set; }
    public string? PosicionPreferida { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaAlta { get; set; } = DateTime.UtcNow;

    public ICollection<JugadorAlias> Aliases { get; set; } = new List<JugadorAlias>();
    public ICollection<RendimientoJugador> Rendimientos { get; set; } = new List<RendimientoJugador>();
}

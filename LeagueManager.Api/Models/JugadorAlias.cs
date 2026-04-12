namespace LeagueManager.Api.Models;

public class JugadorAlias : BaseEntity
{
    public int JugadorId { get; set; }
    public string Alias { get; set; } = string.Empty;
    public string AliasNormalizado { get; set; } = string.Empty;

    public Jugador Jugador { get; set; } = default!;
}

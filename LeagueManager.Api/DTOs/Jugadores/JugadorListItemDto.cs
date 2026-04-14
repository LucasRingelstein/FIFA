using LeagueManager.Api.Enums;

namespace LeagueManager.Api.DTOs.Jugadores;

public class JugadorListItemDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public CategoriaPlantel CategoriaBase { get; set; }
    public string? PosicionPreferida { get; set; }
    public bool Activo { get; set; }
}

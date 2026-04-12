using LeagueManager.Api.Enums;

namespace LeagueManager.Api.DTOs.Importaciones;

public class ImportPreviewRowDto
{
    public int RowNumber { get; set; }
    public string Jugador { get; set; } = string.Empty;
    public string JugadorNormalizado { get; set; } = string.Empty;
    public string? Posicion { get; set; }
    public decimal? Valoracion { get; set; }
    public int Goles { get; set; }
    public int Asistencias { get; set; }
    public bool EsSuplente { get; set; }
    public bool Jugo { get; set; }
    public CategoriaPlantel CategoriaPlantel { get; set; }
}

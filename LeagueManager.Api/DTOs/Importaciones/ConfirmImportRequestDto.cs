using LeagueManager.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace LeagueManager.Api.DTOs.Importaciones;

public class ConfirmImportRequestDto
{
    [Required]
    public string ModoCarga { get; set; } = "excel"; // excel | manual

    [Required]
    public CategoriaPlantel CategoriaPlantel { get; set; }

    public string? NombreArchivo { get; set; }
    public DateOnly? FechaPartido { get; set; }
    public string? Rival { get; set; }

    [MinLength(1)]
    public List<ConfirmImportRowDto> Filas { get; set; } = new();
}

public class ConfirmImportRowDto
{
    [Required]
    public string Jugador { get; set; } = string.Empty;
    public string? Posicion { get; set; }
    public decimal? Valoracion { get; set; }
    public int Goles { get; set; }
    public int Asistencias { get; set; }
    public bool EsSuplente { get; set; }
    public bool Jugo { get; set; }
}

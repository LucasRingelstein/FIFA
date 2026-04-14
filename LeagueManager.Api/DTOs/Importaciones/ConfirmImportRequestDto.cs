using LeagueManager.Api.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LeagueManager.Api.DTOs.Importaciones;

public class ConfirmImportRequestDto
{
    public string? ModoCarga { get; set; } = "excel"; // excel | manual

    public CategoriaPlantel? CategoriaPlantel { get; set; }

    public string? NombreArchivo { get; set; }
    public DateOnly? FechaPartido { get; set; }
    public string? Rival { get; set; }

    [MinLength(1)]
    public List<ConfirmImportRowDto> Filas { get; set; } = new();

    // Alias para compatibilidad si llega "rows" desde algún cliente viejo.
    [JsonPropertyName("rows")]
    public List<ConfirmImportRowDto>? Rows { get; set; }
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

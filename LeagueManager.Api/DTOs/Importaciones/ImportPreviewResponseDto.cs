using LeagueManager.Api.Enums;

namespace LeagueManager.Api.DTOs.Importaciones;

public class ImportPreviewResponseDto
{
    public string NombreArchivo { get; set; } = string.Empty;
    public string HojaLeida { get; set; } = string.Empty;
    public DateOnly? FechaPartido { get; set; }
    public string? Rival { get; set; }
    public CategoriaPlantel? CategoriaDetectada { get; set; }

    public int FilasLeidas { get; set; }
    public int FilasValidas { get; set; }

    public List<string> Errores { get; set; } = new();
    public List<string> Advertencias { get; set; } = new();
    public List<ImportPreviewRowDto> Filas { get; set; } = new();
}

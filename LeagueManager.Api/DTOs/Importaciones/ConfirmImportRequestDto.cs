using LeagueManager.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace LeagueManager.Api.DTOs.Importaciones;

public class ConfirmImportRequestDto
{
    [Required]
    public string NombreArchivo { get; set; } = string.Empty;

    public DateOnly? FechaPartido { get; set; }
    public string? Rival { get; set; }
    public CategoriaPlantel? CategoriaPlantel { get; set; }
}

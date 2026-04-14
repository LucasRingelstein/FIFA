using LeagueManager.Api.Enums;

namespace LeagueManager.Api.Models;

public class ImportacionArchivo : BaseEntity
{
    public string NombreArchivo { get; set; } = string.Empty;
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public EstadoImportacion Estado { get; set; } = EstadoImportacion.Pendiente;
    public string? Observaciones { get; set; }
    public int FilasProcesadas { get; set; }
    public int JugadoresNuevos { get; set; }
    public int? PartidoId { get; set; }

    public Partido? Partido { get; set; }
}

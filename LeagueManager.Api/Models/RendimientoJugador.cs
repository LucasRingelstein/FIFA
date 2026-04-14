namespace LeagueManager.Api.Models;

public class RendimientoJugador : BaseEntity
{
    public int PartidoId { get; set; }
    public int JugadorId { get; set; }

    public string? Posicion { get; set; }
    public decimal? Valoracion { get; set; }
    public int Goles { get; set; }
    public int Asistencias { get; set; }
    public bool EsSuplente { get; set; }
    public bool Jugo { get; set; }

    public int? OrdenRendimiento { get; set; }
    public int? PuestoJugados { get; set; }
    public decimal PuntosRanking { get; set; }
    public decimal BonusGA { get; set; }
    public int? PuestoTitulares { get; set; }
    public decimal PenalizacionPeores5 { get; set; }
    public decimal MultiplicadorSuplente { get; set; } = 1m;
    public decimal PuntosFinales { get; set; }

    public Partido Partido { get; set; } = default!;
    public Jugador Jugador { get; set; } = default!;
}

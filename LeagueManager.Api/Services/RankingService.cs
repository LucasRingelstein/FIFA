using LeagueManager.Api.Data;
using LeagueManager.Api.DTOs.Rankings;
using LeagueManager.Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace LeagueManager.Api.Services;

public interface IRankingService
{
    Task<List<RankingGeneralItemDto>> GetGeneralAsync(CategoriaPlantel? categoria, CancellationToken cancellationToken = default);
    Task<List<Mejor11ItemDto>> GetMejor11Async(CategoriaPlantel? categoria, CancellationToken cancellationToken = default);
}

public class RankingService : IRankingService
{
    private readonly AppDbContext _db;

    public RankingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<RankingGeneralItemDto>> GetGeneralAsync(CategoriaPlantel? categoria, CancellationToken cancellationToken = default)
    {
        var query = _db.RendimientosJugador
            .AsNoTracking()
            .Include(x => x.Jugador)
            .Include(x => x.Partido)
            .Where(x => x.Jugo);

        if (categoria.HasValue)
        {
            query = query.Where(x => x.Partido.CategoriaPlantel == categoria.Value);
        }

        return await query
            .GroupBy(x => new { x.JugadorId, x.Jugador.Nombre })
            .Select(g => new RankingGeneralItemDto
            {
                JugadorId = g.Key.JugadorId,
                Jugador = g.Key.Nombre,
                Partidos = g.Count(),
                PuntosTotales = Math.Round(g.Sum(x => x.PuntosFinales), 2),
                Promedio = Math.Round(g.Average(x => x.PuntosFinales), 2)
            })
            .OrderByDescending(x => x.PuntosTotales)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Mejor11ItemDto>> GetMejor11Async(CategoriaPlantel? categoria, CancellationToken cancellationToken = default)
    {
        var query = _db.RendimientosJugador
            .AsNoTracking()
            .Include(x => x.Jugador)
            .Include(x => x.Partido)
            .Where(x => x.Jugo);

        if (categoria.HasValue)
        {
            query = query.Where(x => x.Partido.CategoriaPlantel == categoria.Value);
        }

        return await query
            .GroupBy(x => new { x.JugadorId, x.Jugador.Nombre })
            .Select(g => new Mejor11ItemDto
            {
                JugadorId = g.Key.JugadorId,
                Jugador = g.Key.Nombre,
                Posicion = g.Where(x => x.Posicion != null)
                    .GroupBy(x => x.Posicion!)
                    .OrderByDescending(x => x.Count())
                    .Select(x => x.Key)
                    .FirstOrDefault() ?? "N/A",
                Valor = Math.Round(g.Average(x => x.PuntosFinales), 2)
            })
            .OrderByDescending(x => x.Valor)
            .Take(11)
            .ToListAsync(cancellationToken);
    }
}

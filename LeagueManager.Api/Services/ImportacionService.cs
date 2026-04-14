using LeagueManager.Api.Data;
using LeagueManager.Api.DTOs.Importaciones;
using LeagueManager.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueManager.Api.Services;

public interface IImportacionService
{
    Task<ConfirmImportResponseDto> ConfirmarAsync(ConfirmImportRequestDto request, CancellationToken cancellationToken = default);
}

public class ImportacionService : IImportacionService
{
    private readonly AppDbContext _db;
    private readonly INombreNormalizer _nombreNormalizer;

    public ImportacionService(AppDbContext db, INombreNormalizer nombreNormalizer)
    {
        _db = db;
        _nombreNormalizer = nombreNormalizer;
    }

    public async Task<ConfirmImportResponseDto> ConfirmarAsync(ConfirmImportRequestDto request, CancellationToken cancellationToken = default)
    {
        var inputFilas = request.Filas.Count > 0 ? request.Filas : (request.Rows ?? new List<ConfirmImportRowDto>());
        var filas = inputFilas.Where(x => !string.IsNullOrWhiteSpace(x.Jugador)).ToList();
        if (filas.Count == 0)
        {
            throw new InvalidOperationException("No hay filas válidas para importar.");
        }

        var fechaPartido = request.FechaPartido ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var rival = string.IsNullOrWhiteSpace(request.Rival) ? "Sin Rival" : request.Rival.Trim();
        var categoria = request.CategoriaPlantel ?? Enums.CategoriaPlantel.Mayor;
        var modoCarga = string.IsNullOrWhiteSpace(request.ModoCarga) ? "excel" : request.ModoCarga.Trim().ToLowerInvariant();

        var exists = await _db.Partidos.AnyAsync(
            x => x.FechaPartido == fechaPartido && x.Rival == rival && x.CategoriaPlantel == categoria,
            cancellationToken);

        if (exists)
        {
            throw new InvalidOperationException("Ya existe un partido con Fecha + Rival + Categoría.");
        }

        var partido = new Partido
        {
            FechaPartido = fechaPartido,
            Rival = rival,
            CategoriaPlantel = categoria,
            ArchivoOriginal = request.NombreArchivo ?? $"manual-{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx",
            FechaImportacion = DateTime.UtcNow
        };

        _db.Partidos.Add(partido);
        await _db.SaveChangesAsync(cancellationToken);

        var jugadoresNuevos = 0;
        var rendimientos = new List<RendimientoJugador>();

        foreach (var row in filas)
        {
            var nombreNormalizado = _nombreNormalizer.Normalize(row.Jugador);

            var jugador = await _db.Jugadores.FirstOrDefaultAsync(
                x => x.NombreNormalizado == nombreNormalizado,
                cancellationToken);

            if (jugador is null)
            {
                jugador = new Jugador
                {
                    Nombre = row.Jugador.Trim(),
                    NombreNormalizado = nombreNormalizado,
                    CategoriaBase = categoria,
                    PosicionPreferida = row.Posicion,
                    Activo = true,
                    FechaAlta = DateTime.UtcNow
                };

                _db.Jugadores.Add(jugador);
                await _db.SaveChangesAsync(cancellationToken);
                jugadoresNuevos++;
            }

            rendimientos.Add(new RendimientoJugador
            {
                PartidoId = partido.Id,
                JugadorId = jugador.Id,
                Posicion = row.Posicion,
                Valoracion = row.Valoracion,
                Goles = row.Goles,
                Asistencias = row.Asistencias,
                EsSuplente = row.EsSuplente,
                Jugo = row.Jugo,
                MultiplicadorSuplente = row.EsSuplente ? 0.8m : 1m
            });
        }

        CalcularPuntos(rendimientos);

        _db.RendimientosJugador.AddRange(rendimientos);

        _db.ImportacionesArchivo.Add(new ImportacionArchivo
        {
            NombreArchivo = request.NombreArchivo ?? "CargaManual",
            Fecha = DateTime.UtcNow,
            Estado = Enums.EstadoImportacion.Confirmada,
            FilasProcesadas = rendimientos.Count,
            JugadoresNuevos = jugadoresNuevos,
            PartidoId = partido.Id,
            Observaciones = $"Modo: {modoCarga}"
        });

        await _db.SaveChangesAsync(cancellationToken);

        return new ConfirmImportResponseDto
        {
            PartidoId = partido.Id,
            FilasGuardadas = rendimientos.Count,
            JugadoresNuevos = jugadoresNuevos
        };
    }

    private static void CalcularPuntos(List<RendimientoJugador> rendimientos)
    {
        var jugados = rendimientos.Where(x => x.Jugo).OrderByDescending(x => x.Valoracion ?? 0m).ToList();

        for (var i = 0; i < jugados.Count; i++)
        {
            var item = jugados[i];
            var puesto = i + 1;

            item.OrdenRendimiento = puesto;
            item.PuestoJugados = puesto;
            item.PuntosRanking = jugados.Count - i;
            item.BonusGA = (item.Goles * 2m) + (item.Asistencias * 1.5m);
            item.PuestoTitulares = item.EsSuplente ? null : puesto;
            item.PenalizacionPeores5 = !item.EsSuplente && puesto > Math.Max(0, jugados.Count - 5) ? -0.5m : 0m;
            item.PuntosFinales = Math.Round(((item.Valoracion ?? 0m) + item.PuntosRanking + item.BonusGA + item.PenalizacionPeores5) * item.MultiplicadorSuplente, 2);
        }

        foreach (var item in rendimientos.Where(x => !x.Jugo))
        {
            item.OrdenRendimiento = null;
            item.PuestoJugados = null;
            item.PuntosRanking = 0;
            item.BonusGA = 0;
            item.PuestoTitulares = null;
            item.PenalizacionPeores5 = 0;
            item.PuntosFinales = 0;
        }
    }
}

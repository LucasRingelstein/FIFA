using LeagueManager.Api.Data;
using LeagueManager.Api.DTOs.Partidos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartidosController : ControllerBase
{
    private readonly AppDbContext _db;

    public PartidosController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<PartidoListItemDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _db.Partidos
            .AsNoTracking()
            .OrderByDescending(x => x.FechaPartido)
            .Select(x => new PartidoListItemDto
            {
                Id = x.Id,
                FechaPartido = x.FechaPartido,
                Rival = x.Rival,
                CategoriaPlantel = x.CategoriaPlantel
            })
            .ToListAsync(cancellationToken);

        return Ok(items);
    }
}

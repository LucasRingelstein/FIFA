using LeagueManager.Api.Data;
using LeagueManager.Api.DTOs.Jugadores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JugadoresController : ControllerBase
{
    private readonly AppDbContext _db;

    public JugadoresController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<JugadorListItemDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _db.Jugadores
            .AsNoTracking()
            .OrderBy(x => x.Nombre)
            .Select(x => new JugadorListItemDto
            {
                Id = x.Id,
                Nombre = x.Nombre,
                CategoriaBase = x.CategoriaBase,
                PosicionPreferida = x.PosicionPreferida,
                Activo = x.Activo
            })
            .ToListAsync(cancellationToken);

        return Ok(items);
    }
}

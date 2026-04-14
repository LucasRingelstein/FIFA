using LeagueManager.Api.Enums;
using LeagueManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RankingsController : ControllerBase
{
    private readonly IRankingService _rankingService;

    public RankingsController(IRankingService rankingService)
    {
        _rankingService = rankingService;
    }

    [HttpGet("general")]
    public async Task<IActionResult> GetGeneral([FromQuery] CategoriaPlantel? categoria, CancellationToken cancellationToken)
    {
        var items = await _rankingService.GetGeneralAsync(categoria, cancellationToken);
        return Ok(new { categoria, items });
    }

    [HttpGet("mejor11")]
    public async Task<IActionResult> GetMejor11([FromQuery] CategoriaPlantel? categoria, CancellationToken cancellationToken)
    {
        var items = await _rankingService.GetMejor11Async(categoria, cancellationToken);
        return Ok(new { categoria, items });
    }
}

using Microsoft.AspNetCore.Mvc;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RankingsController : ControllerBase
{
    [HttpGet("general")]
    public IActionResult GetGeneral([FromQuery] string categoria) => Ok(new { categoria, items = Array.Empty<object>() });

    [HttpGet("mejor11")]
    public IActionResult GetMejor11([FromQuery] string categoria) => Ok(new { categoria, items = Array.Empty<object>() });
}

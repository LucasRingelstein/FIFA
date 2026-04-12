using Microsoft.AspNetCore.Mvc;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartidosController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(Array.Empty<object>());
}

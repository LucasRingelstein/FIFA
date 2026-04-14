using LeagueManager.Api.DTOs.Importaciones;
using LeagueManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportacionesController : ControllerBase
{
    private readonly IExcelImportService _excelImportService;

    public ImportacionesController(IExcelImportService excelImportService)
    {
        _excelImportService = excelImportService;
    }

    [HttpPost("preview")]
    [ProducesResponseType(typeof(ImportPreviewResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ImportPreviewResponseDto>> Preview([FromForm] IFormFile archivo, CancellationToken cancellationToken)
    {
        if (archivo is null)
        {
            return BadRequest("Debe enviar un archivo .xlsx.");
        }

        var response = await _excelImportService.PreviewAsync(archivo, cancellationToken);
        return Ok(response);
    }

    [HttpPost("confirmar")]
    public ActionResult Confirmar([FromBody] ConfirmImportRequestDto request)
    {
        return StatusCode(StatusCodes.Status501NotImplemented,
            new { mensaje = "Endpoint base creado. En el próximo paso se implementa el guardado definitivo y recálculo de puntajes.", request.NombreArchivo });
    }
}

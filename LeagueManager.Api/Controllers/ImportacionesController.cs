using LeagueManager.Api.DTOs.Importaciones;
using LeagueManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeagueManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportacionesController : ControllerBase
{
    private readonly IExcelImportService _excelImportService;
    private readonly IImportacionService _importacionService;

    public ImportacionesController(IExcelImportService excelImportService, IImportacionService importacionService)
    {
        _excelImportService = excelImportService;
        _importacionService = importacionService;
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
    [ProducesResponseType(typeof(ConfirmImportResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ConfirmImportResponseDto>> Confirmar([FromBody] ConfirmImportRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _importacionService.ConfirmarAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}

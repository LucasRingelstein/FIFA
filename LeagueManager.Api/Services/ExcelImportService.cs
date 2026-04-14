using ClosedXML.Excel;
using LeagueManager.Api.DTOs.Importaciones;
using LeagueManager.Api.Enums;

namespace LeagueManager.Api.Services;

public interface IExcelImportService
{
    Task<ImportPreviewResponseDto> PreviewAsync(IFormFile file, CancellationToken cancellationToken = default);
}

public class ExcelImportService : IExcelImportService
{
    private static readonly string[] RequiredColumns =
    [
        "FechaPartido", "CategoriaPlantel", "Rival", "Jugador", "Posicion", "Valoracion", "Goles", "Asistencias", "EsSuplente", "Jugo"
    ];

    private readonly INombreNormalizer _nombreNormalizer;

    public ExcelImportService(INombreNormalizer nombreNormalizer)
    {
        _nombreNormalizer = nombreNormalizer;
    }

    public async Task<ImportPreviewResponseDto> PreviewAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        var response = new ImportPreviewResponseDto { NombreArchivo = file.FileName };

        if (file.Length == 0)
        {
            response.Errores.Add("El archivo está vacío.");
            return response;
        }

        await using var stream = file.OpenReadStream();
        using var workbook = new XLWorkbook(stream);

        var worksheet = workbook.Worksheets.FirstOrDefault(x => x.Name.Equals("ImportPartido", StringComparison.OrdinalIgnoreCase))
                        ?? workbook.Worksheets.FirstOrDefault();

        if (worksheet is null)
        {
            response.Errores.Add("No se encontró ninguna hoja en el archivo.");
            return response;
        }

        response.HojaLeida = worksheet.Name;

        var usedRange = worksheet.RangeUsed();
        if (usedRange is null)
        {
            response.Errores.Add("La hoja está vacía.");
            return response;
        }

        var headerRow = usedRange.FirstRow();
        var headers = headerRow.Cells()
            .Select((cell, index) => new { Name = cell.GetString().Trim(), Column = index + 1 })
            .Where(x => !string.IsNullOrWhiteSpace(x.Name))
            .ToDictionary(x => x.Name, x => x.Column, StringComparer.OrdinalIgnoreCase);

        foreach (var col in RequiredColumns)
        {
            if (!headers.ContainsKey(col))
            {
                response.Errores.Add($"Falta la columna requerida: {col}.");
            }
        }

        if (response.Errores.Count > 0)
        {
            return response;
        }

        var categoriaSet = new HashSet<CategoriaPlantel>();
        var firstRow = headerRow.RowBelow().RowNumber();
        var lastRow = usedRange.LastRow().RowNumber();

        response.FilasLeidas = Math.Max(0, lastRow - firstRow + 1);

        for (var rowNumber = firstRow; rowNumber <= lastRow; rowNumber++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var row = worksheet.Row(rowNumber);

            var jugador = GetString(row, headers, "Jugador");
            if (string.IsNullOrWhiteSpace(jugador))
            {
                continue;
            }

            var categoriaRaw = GetString(row, headers, "CategoriaPlantel");
            if (!TryParseCategoria(categoriaRaw, out var categoria))
            {
                response.Advertencias.Add($"Fila {rowNumber}: categoría inválida '{categoriaRaw}'.");
                continue;
            }

            categoriaSet.Add(categoria);

            var dto = new ImportPreviewRowDto
            {
                RowNumber = rowNumber,
                Jugador = jugador.Trim(),
                JugadorNormalizado = _nombreNormalizer.Normalize(jugador),
                Posicion = GetString(row, headers, "Posicion"),
                Valoracion = GetDecimalNullable(row, headers, "Valoracion"),
                Goles = GetInt(row, headers, "Goles"),
                Asistencias = GetInt(row, headers, "Asistencias"),
                EsSuplente = GetBool(row, headers, "EsSuplente"),
                Jugo = GetBool(row, headers, "Jugo"),
                CategoriaPlantel = categoria
            };

            response.Filas.Add(dto);
        }

        response.FilasValidas = response.Filas.Count;

        if (categoriaSet.Count > 1)
        {
            response.Errores.Add("El archivo mezcla categorías (Mayor/Juvenil). La importación debe ser de una sola categoría.");
        }

        response.CategoriaDetectada = categoriaSet.Count == 1 ? categoriaSet.First() : null;

        response.FechaPartido = TryGetDate(worksheet.Row(firstRow), headers, "FechaPartido");
        response.Rival = GetString(worksheet.Row(firstRow), headers, "Rival");

        if (response.FechaPartido is null)
        {
            response.Advertencias.Add("No se detectó FechaPartido. Se podrá completar manualmente al confirmar.");
        }

        if (string.IsNullOrWhiteSpace(response.Rival))
        {
            response.Advertencias.Add("No se detectó Rival. Se podrá completar manualmente al confirmar.");
        }

        return response;
    }

    private static string GetString(IXLRow row, IReadOnlyDictionary<string, int> headers, string key)
        => headers.TryGetValue(key, out var col) ? row.Cell(col).GetString().Trim() : string.Empty;

    private static int GetInt(IXLRow row, IReadOnlyDictionary<string, int> headers, string key)
    {
        if (!headers.TryGetValue(key, out var col)) return 0;
        var cell = row.Cell(col);
        return cell.TryGetValue<int>(out var value) ? value : 0;
    }

    private static decimal? GetDecimalNullable(IXLRow row, IReadOnlyDictionary<string, int> headers, string key)
    {
        if (!headers.TryGetValue(key, out var col)) return null;
        var cell = row.Cell(col);
        return cell.TryGetValue<decimal>(out var value) ? value : null;
    }

    private static bool GetBool(IXLRow row, IReadOnlyDictionary<string, int> headers, string key)
    {
        var raw = GetString(row, headers, key);
        if (string.IsNullOrWhiteSpace(raw)) return false;

        return raw.Trim().ToLowerInvariant() switch
        {
            "1" or "true" or "si" or "sí" or "x" => true,
            _ => false
        };
    }

    private static DateOnly? TryGetDate(IXLRow row, IReadOnlyDictionary<string, int> headers, string key)
    {
        if (!headers.TryGetValue(key, out var col)) return null;
        var cell = row.Cell(col);

        if (cell.TryGetValue<DateTime>(out var dt))
        {
            return DateOnly.FromDateTime(dt);
        }

        if (DateOnly.TryParse(cell.GetString(), out var dateOnly))
        {
            return dateOnly;
        }

        return null;
    }

    private static bool TryParseCategoria(string? value, out CategoriaPlantel categoria)
    {
        categoria = default;
        if (string.IsNullOrWhiteSpace(value)) return false;

        var normalized = value.Trim().ToLowerInvariant();
        return normalized switch
        {
            "mayor" => (categoria = CategoriaPlantel.Mayor) == CategoriaPlantel.Mayor,
            "juvenil" => (categoria = CategoriaPlantel.Juvenil) == CategoriaPlantel.Juvenil,
            _ => false
        };
    }
}

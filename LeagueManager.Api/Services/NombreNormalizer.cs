using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace LeagueManager.Api.Services;

public interface INombreNormalizer
{
    string Normalize(string? input);
}

public class NombreNormalizer : INombreNormalizer
{
    private static readonly Regex MultipleSpacesRegex = new(@"\s+", RegexOptions.Compiled);

    public string Normalize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        var noDots = input.Replace('.', ' ');
        var decomposed = noDots.Normalize(NormalizationForm.FormD);

        var sb = new StringBuilder();
        foreach (var c in decomposed)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        var noAccents = sb.ToString().Normalize(NormalizationForm.FormC);
        var collapsed = MultipleSpacesRegex.Replace(noAccents, " ").Trim();
        return collapsed.ToUpperInvariant();
    }
}

namespace CloudApi.Options;

public class AntiforgeryOptions
{
    public const string SectionName = "Antiforgery";

    public string SignCookieName { get; set; } = "SIGN-ANTIFORGERY";

    public string ResponseCookieName { get; set; } = "CSRF-TOKEN";

    public string HeaderName { get; set; } = "X-CSRF-TOKEN";
}

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.Extensions.Options;

using CloudAntiforgeryOptions = CloudApi.Options.AntiforgeryOptions;

namespace CloudApi.Antiforgery;

public class AntiforgeryTokenIssuer : IAntiforgeryTokenIssuer
{
    private readonly IAntiforgery _antiforgery;

    private readonly CloudAntiforgeryOptions _antiforgeryOptions;

    public AntiforgeryTokenIssuer(IAntiforgery antiforgery, IOptions<CloudAntiforgeryOptions> antiforgeryOptionsAccessor)
    {
        _antiforgery = antiforgery;
        _antiforgeryOptions = antiforgeryOptionsAccessor.Value;
    }

    public void IssueToken(HttpContext context)
    {
        var tokens = _antiforgery.GetAndStoreTokens(context);
        context.Response.Cookies.Append(
            _antiforgeryOptions.ResponseCookieName,
            tokens.RequestToken!,
            new CookieOptions
            {
                HttpOnly = false,
                SameSite = SameSiteMode.Strict,
                Path = "/",
                IsEssential = true
            });
    }
}

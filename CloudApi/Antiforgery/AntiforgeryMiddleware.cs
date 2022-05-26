namespace CloudApi.Antiforgery;

public class AntiforgeryMiddleware
{
    private readonly RequestDelegate _next;

    private readonly IAntiforgeryTokenIssuer _antiforgeryTokenIssuer;

    public AntiforgeryMiddleware(RequestDelegate next, IAntiforgeryTokenIssuer antiforgeryTokenIssuer)
    {
        _next = next;
        _antiforgeryTokenIssuer = antiforgeryTokenIssuer;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Endpoint? endpoint = context.GetEndpoint();

        await _next(context);

        if (endpoint == null)
        {
            return;
        }

        var attribute = endpoint.Metadata.GetMetadata<IssuesAntiforgeryTokenAttribute>();
        if (attribute == null)
        {
            return;
        }

        if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
        {
            _antiforgeryTokenIssuer.IssueToken(context);
        }
    }
}

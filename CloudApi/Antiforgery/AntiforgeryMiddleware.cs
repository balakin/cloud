namespace CloudApi.Antiforgery;

public class AntiforgeryMiddleware
{
    private readonly RequestDelegate _next;

    private readonly IAntiforgeryTokenSender _antiforgeryTokenSender;

    public AntiforgeryMiddleware(RequestDelegate next, IAntiforgeryTokenSender antiforgeryTokenSender)
    {
        _next = next;
        _antiforgeryTokenSender = antiforgeryTokenSender;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Endpoint? endpoint = context.GetEndpoint();

        await _next(context);

        if (endpoint == null)
        {
            return;
        }

        var issueAttribute = endpoint.Metadata.GetMetadata<IssuesAntiforgeryTokenAttribute>();
        if (issueAttribute != null)
        {
            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
            {
                _antiforgeryTokenSender.SendToken(context);
            }

            return;
        }

        var resetAttribute = endpoint.Metadata.GetMetadata<ResetAntiforgeryTokenAttribute>();
        if (resetAttribute != null)
        {
            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
            {
                _antiforgeryTokenSender.ResetToken(context);
            }
        }
    }
}

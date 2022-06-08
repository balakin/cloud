using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;

using CloudAntiforgeryOptions = CloudApi.Options.AntiforgeryOptions;

namespace CloudApi.Antiforgery;

public class AntiforgeryFilter : IAsyncActionFilter
{
    private readonly IAntiforgeryTokenSender _antiforgeryTokenSender;

    private readonly CloudAntiforgeryOptions _antiforgeryOptions;

    public AntiforgeryFilter(IAntiforgeryTokenSender antiforgeryTokenSender, IOptions<CloudAntiforgeryOptions> antiforgeryOptionsAccessor)
    {
        _antiforgeryTokenSender = antiforgeryTokenSender;
        _antiforgeryOptions = antiforgeryOptionsAccessor.Value;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var antiforgery = context.HttpContext.RequestServices.GetRequiredService<IAntiforgery>();
        if (await antiforgery.IsRequestValidAsync(context.HttpContext))
        {
            await next();
        }
        else
        {
            if (context.HttpContext.Request.Headers.ContainsKey(_antiforgeryOptions.HeaderName))
            {
                _antiforgeryTokenSender.ResetToken(context.HttpContext);
            }

            context.Result = new BadRequestResult();
        }
    }
}

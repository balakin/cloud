using CloudApi.Antiforgery;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudApplicationBuilderExtensions
{
    public static IApplicationBuilder UseCloudAntiforgery(this IApplicationBuilder builder)
    {
        builder.UseMiddleware<AntiforgeryMiddleware>();
        return builder;
    }
}

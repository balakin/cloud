using CloudApi.Antiforgery;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.Extensions.Options;

using CloudAntiforgeryOptions = CloudApi.Options.AntiforgeryOptions;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudAntiforgery(this IServiceCollection services)
    {
        services.AddAntiforgery();

        services.AddOptions<AntiforgeryOptions>()
            .Configure<IOptions<CloudAntiforgeryOptions>>((options, cloudOptionsAccessor) =>
            {
                CloudAntiforgeryOptions cloudOptions = cloudOptionsAccessor.Value;
                options.Cookie.Name = cloudOptions.SignCookieName;
                options.HeaderName = cloudOptions.HeaderName;
            });

        services.AddTransient<IAntiforgeryTokenIssuer, AntiforgeryTokenIssuer>();

        return services;
    }
}

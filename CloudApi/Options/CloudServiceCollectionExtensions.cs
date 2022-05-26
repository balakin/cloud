using CloudApi.Options;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudOptions(this IServiceCollection services, ConfigurationManager configuration)
    {
        services.Configure<ApplicationOptions>(configuration.GetSection(ApplicationOptions.SectionName));

        services.Configure<AntiforgeryOptions>(configuration.GetSection(AntiforgeryOptions.SectionName));

        services.Configure<AuthOptions>(configuration.GetSection(AuthOptions.SectionName));

        return services;
    }
}

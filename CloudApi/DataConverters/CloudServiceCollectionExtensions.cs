using Microsoft.AspNetCore.Mvc.Infrastructure;
using CloudApi.DataConverters;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudDataConverters(this IServiceCollection services)
    {
        services.AddTransient<IdentityErrorToClientMapper>();
        services.AddTransient<ProblemDetailsFactory, ProblemDetailsClientFactory>();
        return services;
    }
}

using CloudApi.Validation;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudValidators(this IServiceCollection services)
    {
        services.AddTransient<IFormFileValidator, FormFileValidator>();
        return services;
    }
}

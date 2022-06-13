using CloudApi.Storage;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudStorage(this IServiceCollection services)
    {
        services.AddTransient<ICloudFileProvider, CloudFileProvider>();
        services.AddScoped<IStorageProvider, StorageProvider>();
        return services;
    }
}

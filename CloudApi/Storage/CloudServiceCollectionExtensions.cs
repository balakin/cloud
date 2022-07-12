using CloudApi.Storage;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudStorage(this IServiceCollection services)
    {
        services.AddTransient<ICloudFilesProvider, CloudFilesProvider>();
        services.AddTransient<IFileNameResolver, FileNameResolver>();
        services.AddScoped<ICloudFoldersProvider, CloudFoldersProvider>();
        return services;
    }
}

using CloudApi.Database;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudDevelopmentDatabase(this IServiceCollection services)
    {
        services.AddDbContext<CloudDatabase>((options) => options.UseSqlite("Filename=Cloud.db"));

        return services;
    }
}

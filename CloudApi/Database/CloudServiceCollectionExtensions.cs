using CloudApi.Database;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudDevelopmentDatabase(this IServiceCollection services)
    {
        services.AddDbContext<DatabaseContext>((options) => options.UseSqlite("Filename=Cloud.db"));

        return services;
    }
}

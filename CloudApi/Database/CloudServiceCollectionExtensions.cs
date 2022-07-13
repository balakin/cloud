using CloudApi.Database;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudDevelopmentDatabase(this IServiceCollection services, bool isProduction)
    {
        if (isProduction)
        {
            string? connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
            if (connectionString == null)
            {
                throw new NullReferenceException("No DATABASE_CONNECTION_STRING");
            }

            services.AddDbContext<DatabaseContext>((options) => options.UseNpgsql(connectionString));
        }
        else
        {
            services.AddDbContext<DatabaseContext>((options) => options.UseSqlite("Filename=Cloud.db"));
        }

        return services;
    }
}

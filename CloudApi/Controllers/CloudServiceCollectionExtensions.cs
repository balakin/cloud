using CloudApi.Antiforgery;
using CloudApi.Controllers;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudControllers(this IServiceCollection services)
    {
        services.AddControllers((options) =>
            {
                var slugify = new SlugifyParameterTransformer();
                var transformer = new RouteTokenTransformerConvention(slugify);
                options.Conventions.Add(transformer);

                options.Filters.Add<AntiforgeryFilter>();
            });

        return services;
    }
}

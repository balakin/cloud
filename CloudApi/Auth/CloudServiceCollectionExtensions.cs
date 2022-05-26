using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using CloudApi.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using CloudApi.Options;
using CloudApi.Models;
using CloudApi.Database;

namespace Microsoft.Extensions.DependencyInjection;

public static partial class CloudServiceCollectionExtensions
{
    public static IServiceCollection AddCloudAuth(this IServiceCollection services)
    {
        services.AddIdentity<CloudUser, IdentityRole>()
            .AddEntityFrameworkStores<DatabaseContext>();

        services.AddAuthentication((options) =>
            {
                options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
                options.DefaultForbidScheme = IdentityConstants.ApplicationScheme;
                options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
            });

        services.AddOptions<CookieAuthenticationOptions>(IdentityConstants.ApplicationScheme)
            .Configure<ITicketStore, IOptions<AuthOptions>>((options, store, authOptionsAccessor) =>
            {
                AuthOptions authOptions = authOptionsAccessor.Value;

                options.Cookie.Name = authOptions.SessionCookieName;
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromDays(30 * 6);
                options.SessionStore = store;

                options.Events.OnValidatePrincipal = async (context) =>
                {
                    await SessionCookieValidator.ValidatePrincipalAsync(context);
                    await SecurityStampValidator.ValidatePrincipalAsync(context);
                };

                options.Events.OnRedirectToLogin = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();

        services.AddTransient<ITicketStore, TicketDatabaseStore>();
        services.AddTransient<ISessionInfoCollector, SessionInfoCollector>();
        services.AddTransient<ISessionTicketSerializer, SessionTicketSerializer>();
        services.AddTransient<ISessionInfoSerializer, SessionInfoSerializer>();
        services.AddSingleton<IAuthorizationHandler, DatabaseRoleAuthorizationHandler>();
        return services;
    }
}

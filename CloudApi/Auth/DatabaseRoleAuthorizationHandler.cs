using CloudApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace CloudApi.Auth;

internal sealed class DatabaseRoleAuthorizationHandler : AuthorizationHandler<RolesAuthorizationRequirement>
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public DatabaseRoleAuthorizationHandler(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, RolesAuthorizationRequirement requirement)
    {
        if (context.User == null)
        {
            return;
        }

        using var scope = _serviceScopeFactory.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<CloudUser>>();
        CloudUser user = await userManager.GetUserAsync(context.User);
        if (user == null)
        {
            context.Fail();
            return;
        }

        foreach (string role in requirement.AllowedRoles)
        {
            if (await userManager.IsInRoleAsync(user, role))
            {
                context.Succeed(requirement);
                return;
            }
        }

        context.Fail();
    }
}

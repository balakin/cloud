using System.Security.Claims;
using CloudApi.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace CloudApi.Auth;

internal static class SessionCookieValidator
{
    public static async Task ValidatePrincipalAsync(CookieValidatePrincipalContext context)
    {
        ClaimsIdentity? identity = context.Principal?.Identities.First();
        if (identity == null)
        {
            throw new NullReferenceException(nameof(identity));
        }

        var collector = context.HttpContext.RequestServices.GetRequiredService<ISessionInfoCollector>();
        SessionInfo sessionInfo = collector.Collect(context.HttpContext);

        var serializer = context.HttpContext.RequestServices.GetRequiredService<ISessionInfoSerializer>();
        IEnumerable<Claim> collectedClaims = serializer.Serialize(sessionInfo);
        bool shouldRenewInDatabase = false;
        foreach (Claim claim in collectedClaims)
        {
            Claim? foundClaim = identity.FindFirst(claim.Type);

            if (foundClaim == null)
            {
                identity.AddClaim(claim);
                shouldRenewInDatabase = true;
            }
            else if (foundClaim.Value != claim.Value)
            {
                identity.RemoveClaim(foundClaim);
                identity.AddClaim(claim);
                shouldRenewInDatabase = true;
            }
        }

        if (shouldRenewInDatabase)
        {
            string? key = serializer.ExtractSessionKey(context.Principal!);
            if (key == null)
            {
                throw new NullReferenceException(nameof(key));
            }

            ITicketStore? store = context.Options.SessionStore;
            if (store == null)
            {
                throw new NullReferenceException(nameof(store));
            }

            var ticket = new AuthenticationTicket(context.Principal!, context.Properties, context.Scheme.Name);
            await store.RenewAsync(key, ticket);
        }
    }
}

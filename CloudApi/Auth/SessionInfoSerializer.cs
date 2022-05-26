using System.Security.Claims;
using CloudApi.Models;

namespace CloudApi.Auth;

internal sealed class SessionInfoSerializer : ISessionInfoSerializer
{
    public SessionInfo Deserialize(ClaimsPrincipal principal)
    {
        ClaimsIdentity identity = principal.Identities.First();
        return new SessionInfo
        {
            OperationSystem = ExtractClaimValue(identity, AuthConstants.OperationSystemClaimType),
            Ip = ExtractClaimValue(identity, AuthConstants.IpClaimType)
        };
    }

    private static string ExtractClaimValue(ClaimsIdentity identity, string claimType)
    {
        Claim? claim = identity.FindFirst(claimType);
        if (claim == null)
        {
            return string.Empty;
        }

        return claim.Value;
    }

    public string? ExtractSessionKey(ClaimsPrincipal principal)
    {
        return principal.Identities.First().FindFirst(AuthConstants.SessionKeyClaimType)?.Value;
    }

    public IEnumerable<Claim> Serialize(SessionInfo info)
    {
        return new[]
        {
            new Claim(AuthConstants.OperationSystemClaimType, info.OperationSystem),
            new Claim(AuthConstants.IpClaimType, info.Ip)
        };
    }
}

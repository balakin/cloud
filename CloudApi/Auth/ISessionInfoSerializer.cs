using System.Security.Claims;
using CloudApi.Models;

namespace CloudApi.Auth;

public interface ISessionInfoSerializer
{
    public IEnumerable<Claim> Serialize(SessionInfo info);

    public SessionInfo Deserialize(ClaimsPrincipal principal);

    public string? ExtractSessionKey(ClaimsPrincipal principal);
}

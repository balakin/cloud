using CloudApi.Models;

namespace CloudApi.Auth;

public interface ISessionInfoCollector
{
    public SessionInfo Collect(HttpContext context);
}

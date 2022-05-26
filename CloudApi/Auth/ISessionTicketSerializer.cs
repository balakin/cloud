using Microsoft.AspNetCore.Authentication;

namespace CloudApi.Auth;

public interface ISessionTicketSerializer
{
    public Byte[] Serialize(AuthenticationTicket ticket);

    public AuthenticationTicket? Deserialize(Byte[] bytes);
}

using Microsoft.AspNetCore.Authentication;

namespace CloudApi.Auth;

internal sealed class SessionTicketSerializer : ISessionTicketSerializer
{
    private readonly TicketSerializer _serializer = new TicketSerializer();

    public AuthenticationTicket? Deserialize(byte[] bytes)
    {
        return _serializer.Deserialize(bytes);
    }

    public byte[] Serialize(AuthenticationTicket ticket)
    {
        return _serializer.Serialize(ticket);
    }
}

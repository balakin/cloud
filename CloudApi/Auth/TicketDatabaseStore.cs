using System.Security.Claims;
using CloudApi.Database;
using CloudApi.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace CloudApi.Auth;

internal sealed class TicketDatabaseStore : ITicketStore
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public TicketDatabaseStore(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task RemoveAsync(string key)
    {
        await RemoveAsync(key, default);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

        Session? session = await database.Sessions.FindAsync(key);
        if (session == null)
        {
            throw new NullReferenceException(nameof(session));
        }

        database.Remove(session);
        await database.SaveChangesAsync(cancellationToken);
    }

    public async Task RenewAsync(string key, AuthenticationTicket ticket)
    {
        await RenewAsync(key, ticket, default);
    }

    public async Task RenewAsync(string key, AuthenticationTicket ticket, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

        Session? session = await database.Sessions.FindAsync(key);
        if (session == null)
        {
            throw new NullReferenceException(nameof(session));
        }

        SetSessionKeyClaim(ticket.Principal, key);

        var serializer = scope.ServiceProvider.GetRequiredService<ISessionTicketSerializer>();
        session.AuthenticationTicketBytes = serializer.Serialize(ticket);

        await database.SaveChangesAsync(cancellationToken);
    }

    public async Task<AuthenticationTicket?> RetrieveAsync(string key)
    {
        return await RetrieveAsync(key, default);
    }

    public async Task<AuthenticationTicket?> RetrieveAsync(string key, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

        Session? session = await database.Sessions.FindAsync(key);
        if (session == null)
        {
            return null;
        }

        var serializer = scope.ServiceProvider.GetRequiredService<ISessionTicketSerializer>();
        return serializer.Deserialize(session.AuthenticationTicketBytes);
    }

    public async Task<string> StoreAsync(AuthenticationTicket ticket)
    {
        return await StoreAsync(ticket, default);
    }

    public async Task<string> StoreAsync(AuthenticationTicket ticket, CancellationToken cancellationToken)
    {
        if (ticket == null)
        {
            throw new NullReferenceException(nameof(ticket));
        }

        string? userId = ticket?.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            throw new NullReferenceException(nameof(userId));
        }

        var session = new Session()
        {
            Key = Guid.NewGuid().ToString(),
            UserId = userId,
        };

        SetSessionKeyClaim(ticket!.Principal, session.Key);

        using var scope = _serviceScopeFactory.CreateScope();
        var serializer = scope.ServiceProvider.GetRequiredService<ISessionTicketSerializer>();
        session.AuthenticationTicketBytes = serializer.Serialize(ticket);

        var database = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        database.Sessions.Add(session);
        await database.SaveChangesAsync(cancellationToken);

        return session.Key;
    }

    private void SetSessionKeyClaim(ClaimsPrincipal principal, string key)
    {
        ClaimsIdentity identity = principal.Identities.First();
        Claim? foundClaim = identity.FindFirst(AuthConstants.SessionKeyClaimType);
        if (foundClaim != null)
        {
            identity.RemoveClaim(foundClaim);
        }

        Claim claim = new Claim(AuthConstants.SessionKeyClaimType, key);
        principal.Identities.First().AddClaim(claim);
    }
}

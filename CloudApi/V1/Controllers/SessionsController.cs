using System.Security.Claims;
using CloudApi.Database;
using CloudApi.V1.Dto;
using CloudApi.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CloudApi.Models;
using Microsoft.AspNetCore.Authentication;

namespace CloudApi.V1.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class SessionsController : ControllerBase
{
    private readonly DatabaseContext _database;

    private readonly ISessionInfoSerializer _sessionInfoSerializer;

    private readonly ISessionTicketSerializer _sessionTicketSerializer;

    public SessionsController(
        DatabaseContext database,
        ISessionInfoSerializer sessionInfoSerializer,
        ISessionTicketSerializer sessionTicketSerializer)
    {
        _database = database;
        _sessionInfoSerializer = sessionInfoSerializer;
        _sessionTicketSerializer = sessionTicketSerializer;
    }

    /// <summary>
    /// Retrieves user session by key.
    /// </summary>
    /// <param name="key">The key of session.</param>
    /// <returns>The user session.</returns>
    /// <response code="200">The successfully retrieved current user session.</response>
    /// <response code="400">The session key is invalid.</response>
    /// <response code="401">The user unauthorized.</response>
    /// <response code="404">The user session was't found.</response>
    [HttpGet("{key}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionDto>> GetSession(string key)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        string currentKey = User.FindFirst(AuthConstants.SessionKeyClaimType)?.Value!;

        Session? session = await _database.Sessions.FindAsync(key);
        if (session == null || session.UserId != userId)
        {
            return NotFound();
        }

        SessionDto sessionDto = CreateSessionDto(session);
        sessionDto.IsCurrent = sessionDto.Key == currentKey;
        return sessionDto;
    }

    /// <summary>
    /// Retrieves current user session.
    /// </summary>
    /// <returns>Current user session.</returns>
    /// <response code="200">The successfully retrieved current user session.</response>
    /// <response code="401">The user unauthorized.</response>
    [HttpGet("@current")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<SessionDto>> GetCurrentSession()
    {
        string? key = _sessionInfoSerializer.ExtractSessionKey(User);
        if (key == null)
        {
            throw new NullReferenceException(nameof(key));
        }

        Session? session = await _database.Sessions.FindAsync(key);
        if (session == null)
        {
            throw new NullReferenceException(nameof(session));
        }

        SessionDto sessionDto = CreateSessionDto(session);
        sessionDto.IsCurrent = true;
        return sessionDto;
    }

    /// <summary>
    /// Retrieves all user session.
    /// </summary>
    /// <returns>User sessions.</returns>
    /// <response code="200">The successfully retrieved user sessions.</response>
    /// <response code="401">The user unauthorized.</response>
    [HttpGet]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<SessionDto>>> GetSessions()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        string? key = _sessionInfoSerializer.ExtractSessionKey(User);
        if (key == null)
        {
            throw new NullReferenceException(nameof(key));
        }

        var sessions = await _database.Sessions
            .Where((session) => session.UserId == userId)
            .ToListAsync();

        var list = sessions.Select((session) => CreateSessionDto(session)).ToList();
        foreach (SessionDto sessionDto in list)
        {
            sessionDto.IsCurrent = sessionDto.Key == key;
        }

        return list;
    }

    /// <summary>
    /// Deletes user sessions by key.
    /// </summary>
    /// <param href="key">The key of session.</param>
    /// <returns>No content.</returns>
    /// <response code="204">User session was successfully deleted.</response>
    /// <response code="400">The key of session invalid or the session being deleted is equal to the current one.</response>
    /// <response code="401">The user unauthorized.</response>
    /// <response code="401">The session wasn't found.</response>
    [HttpDelete("{key}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSession(string key)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        string? currentKey = _sessionInfoSerializer.ExtractSessionKey(User);
        if (currentKey == null)
        {
            throw new NullReferenceException(nameof(currentKey));
        }

        if (key == currentKey)
        {
            return ValidationProblem(title: "Can't delete current session");
        }

        Session? session = await _database.Sessions.FindAsync(key);
        if (session == null || session.UserId != userId)
        {
            return NotFound();
        }

        _database.Remove(session);
        await _database.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Deletes all user sessions except the current one.
    /// </summary>
    /// <returns>No content.</returns>
    /// <response code="204">User sessions were successfully deleted.</response>
    /// <response code="401">The user unauthorized.</response>
    [HttpDelete]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteAllSession()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        string? key = User.FindFirst(AuthConstants.SessionKeyClaimType)?.Value;
        if (key == null)
        {
            throw new NullReferenceException(nameof(key));
        }

        var sessions = _database.Sessions.Where((session) => session.UserId == userId && session.Key != key);
        _database.RemoveRange(sessions);
        await _database.SaveChangesAsync();
        return NoContent();
    }

    [NonAction]
    private SessionDto CreateSessionDto(Session session)
    {
        AuthenticationTicket? ticket = _sessionTicketSerializer.Deserialize(session.AuthenticationTicketBytes);
        if (ticket == null)
        {
            throw new NullReferenceException(nameof(ticket));
        }

        SessionInfo info = _sessionInfoSerializer.Deserialize(ticket.Principal);
        SessionDto sessionDto = new SessionDto() { Key = session.Key };
        sessionDto.AddSessionInfo(info);
        return sessionDto;
    }
}

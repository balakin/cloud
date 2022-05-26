using CloudApi.Models;
using CloudApi.V1.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<CloudUser> _userManager;

    public UsersController(UserManager<CloudUser> userManager)
    {
        _userManager = userManager;
    }

    /// <summary>
    /// Returns authorized user.
    /// </summary>
    /// <returns>Authorized user.</returns>
    /// <response code="200">Returns authorized user.</response>
    /// <response code="403">User unauthorized.</response>
    /// <response code="404">User not found.</response>
    [HttpGet("@[action]")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> Me()
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound();
        }

        return new UserDto(user);
    }
}

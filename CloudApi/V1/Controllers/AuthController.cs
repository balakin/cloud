using System.Security.Claims;
using CloudApi.Antiforgery;
using CloudApi.Auth;
using CloudApi.Models;
using CloudApi.V1.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<CloudUser> _userManager;

    private readonly SignInManager<CloudUser> _signInManager;

    private readonly ISessionInfoCollector _sessionInfoCollector;

    private readonly ISessionInfoSerializer _sessionInfoSerializer;

    public AuthController(
        UserManager<CloudUser> userManager,
        SignInManager<CloudUser> signInManager,
        ISessionInfoCollector sessionInfoCollector,
        ISessionInfoSerializer sessionInfoSerializer)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _sessionInfoCollector = sessionInfoCollector;
        _sessionInfoSerializer = sessionInfoSerializer;
    }

    /// <summary>
    /// Sign up user.
    /// </summary>
    /// <param name="signUpDto">User sign up data.</param>
    /// <returns>No content.</returns>
    /// <response code="204">User registered.</response>
    /// <response code="400">The sign up data is invalid or the user already authorized or the user already exists.</response>
    [HttpPost("[action]")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SignUp(SignUpDto signUpDto)
    {
        if (User?.Identity?.IsAuthenticated == true)
        {
            return ValidationProblem(title: "User already authenticated.");
        }

        CloudUser user = signUpDto.ToModel();
        string password = signUpDto.Password;

        IdentityResult result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            Console.WriteLine("Drop user");
            foreach (var error in result.Errors)
            {
                Console.WriteLine(error.Description);
            }

            return ValidationProblem(ModelState);
        }

        return NoContent();
    }

    /// <summary>
    /// Authorizes an user by cookies.
    /// </summary>
    /// <param name="signInDto">User sign in data.</param>
    /// <returns>No content.</returns>
    /// <response code="204">The user authorized.</response>
    /// <response code="400">The sign in data is invalid or user already authorized or user can't authorize.</response>
    /// <response code="404">The user not found.</response>
    [HttpPost("[action]")]
    [ResetAntiforgeryToken]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SignIn(SignInDto signInDto)
    {
        if (User?.Identity?.IsAuthenticated == true)
        {
            return ValidationProblem(title: "User already authenticated.");
        }

        CloudUser user = await _userManager.FindByNameAsync(signInDto.UserName);
        if (user == null)
        {
            return ValidationProblem(title: "Invalid username or password");
        }

        bool isValidPassword = await _userManager.CheckPasswordAsync(user, signInDto.Password);
        if (!isValidPassword)
        {
            return ValidationProblem(title: "Invalid username or password");
        }

        bool canSignIn = await _signInManager.CanSignInAsync(user);
        if (!canSignIn)
        {
            return ValidationProblem(title: "Invalid username or password");
        }

        SessionInfo sessionInfo = _sessionInfoCollector.Collect(HttpContext);
        IEnumerable<Claim> claims = _sessionInfoSerializer.Serialize(sessionInfo);
        await _signInManager.SignInWithClaimsAsync(
            user,
            isPersistent: true,
            additionalClaims: claims);

        return NoContent();
    }

    /// <summary>
    /// Logs out the user.
    /// </summary>
    /// <returns>No content.</returns>
    /// <response code="204">The user logout.</response>
    /// <response code="401">The user unauthorized.</response>
    [HttpPost("[action]")]
    [ResetAntiforgeryToken]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        if (User?.Identity?.IsAuthenticated == false)
        {
            return Unauthorized();
        }

        await _signInManager.SignOutAsync();
        return NoContent();
    }
}

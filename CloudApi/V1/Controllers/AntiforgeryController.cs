using CloudApi.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class AntiforgeryController : ControllerBase
{
    /// <summary>
    /// Issues new antiforgery token
    /// </summary>
    /// <returns>No content</returns>
    /// <response code="204">The antiforgery token was issued successfully</response>
    [HttpGet]
    [IssuesAntiforgeryToken]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult Issue()
    {
        return NoContent();
    }
}

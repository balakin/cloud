using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class HelloWorldController : ControllerBase
{
    /// <summary>
    /// Says hello to the whole world.
    /// </summary>
    /// <returns>Hello message.</returns>
    /// <response code="200">Server successfully greeted.</response>
    [HttpGet("[action]")]
    [Consumes("text/plain")]
    [Produces("text/plain")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<string> Say()
    {
        return "Hello World!";
    }
}

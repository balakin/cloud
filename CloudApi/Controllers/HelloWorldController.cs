using Microsoft.AspNetCore.Mvc;

namespace CloudApi.Controllers;

[ApiController]
[Route("[controller]")]
public class HelloWorldController : ControllerBase
{
    [HttpGet("[action]")]
    public ActionResult<string> Say()
    {
        return "Hello World!";
    }
}

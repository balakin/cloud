using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace CloudApi.Controllers;

public class TempPhysicalFileResult : PhysicalFileResult
{
    public TempPhysicalFileResult(string fileName, string contentType)
        : base(fileName, contentType) { }

    public TempPhysicalFileResult(string fileName, MediaTypeHeaderValue contentType)
        : base(fileName, contentType) { }

    public override async Task ExecuteResultAsync(ActionContext context)
    {
        try
        {
            await base.ExecuteResultAsync(context);
        }
        finally
        {
            File.Delete(FileName);
        }
    }
}

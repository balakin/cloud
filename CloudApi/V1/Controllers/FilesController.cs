using System.Security.Claims;
using CloudApi.Models;
using CloudApi.Storage;
using CloudApi.V1.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IStorageProvider _storageProvider;

    public FilesController(IStorageProvider storageProvider)
    {
        _storageProvider = storageProvider;
    }

    /// <summary>
    /// Returns file by id.
    /// </summary>
    /// <returns>File.</returns>
    /// <response code="200">Returns file.</response>
    /// <response code="401">The user unauthorized.</response>
    /// <response code="404">The file not found.</response>
    [HttpGet("{id}")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetFile(string id)
    {
        CloudFileInfo? info = _storageProvider.GetFileInfo(id);
        if (info == null)
        {
            return NotFound();
        }

        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        if (userId != info.UserId)
        {
            return NotFound();
        }

        Stream stream = _storageProvider.GetFileStream(id);
        return File(stream, info.ContentType);
    }

    /// <summary>
    /// Returns file info by id.
    /// </summary>
    /// <returns>File info.</returns>
    /// <response code="200">Returns file info.</response>
    /// <response code="401">The user unauthorized.</response>
    /// <response code="404">The file not found.</response>
    [HttpGet("{id}/info")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<FileInfoDto> GetFileInfo(string id)
    {
        CloudFileInfo? info = _storageProvider.GetFileInfo(id);
        if (info == null)
        {
            return NotFound();
        }

        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        if (userId != info.UserId)
        {
            return NotFound();
        }

        return FileInfoDto.FromModel(info);
    }
}

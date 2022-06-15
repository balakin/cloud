using CloudApi.Models;
using CloudApi.Storage;
using CloudApi.V1.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class FilesController : ControllerBase
{
    private readonly UserManager<CloudUser> _userManager;

    private readonly IStorageProvider _storageProvider;

    public FilesController(UserManager<CloudUser> userManager, IStorageProvider storageProvider)
    {
        _userManager = userManager;
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
        CloudFileInfo? fileInfo = _storageProvider.GetFileInfo(id);
        if (fileInfo == null)
        {
            return NotFound();
        }

        string userId = _userManager.GetUserId(User);
        if (userId != fileInfo.UserId)
        {
            return NotFound();
        }

        Stream stream = _storageProvider.GetFileStream(id);
        return File(stream, fileInfo.ContentType);
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
        CloudFileInfo? fileInfo = _storageProvider.GetFileInfo(id);
        if (fileInfo == null)
        {
            return NotFound();
        }

        string userId = _userManager.GetUserId(User);
        if (userId != fileInfo.UserId)
        {
            return NotFound();
        }

        return FileInfoDto.FromModel(fileInfo);
    }

    /// <summary>
    /// Download file.
    /// </summary>
    /// <returns>File.</returns>
    /// <response code="200">Returns file.</response>
    /// <response code="401">The user unauthorized.</response>
    /// <response code="404">The file not found.</response>
    [HttpGet("{id}/download")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DownloadFile(string id)
    {
        CloudFileInfo? fileInfo = _storageProvider.GetFileInfo(id);
        if (fileInfo == null)
        {
            return NotFound();
        }

        string userId = _userManager.GetUserId(User);
        if (userId != fileInfo.UserId)
        {
            return NotFound();
        }

        Stream stream = _storageProvider.GetFileStream(id);
        return File(stream, fileInfo.ContentType, fileInfo.Name);
    }
}

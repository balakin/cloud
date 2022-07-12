using CloudApi.Helpers;
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

    private readonly ICloudFilesProvider _cloudFilesProvider;

    private readonly ICloudFoldersProvider _cloudFoldersProvider;

    public FilesController(
        UserManager<CloudUser> userManager,
        ICloudFilesProvider cloudFilesProvider,
        ICloudFoldersProvider cloudFoldersProvider)
    {
        _userManager = userManager;
        _cloudFilesProvider = cloudFilesProvider;
        _cloudFoldersProvider = cloudFoldersProvider;
    }

    /// <summary>
    /// Uploads a single file
    /// </summary>
    /// <returns>The file</returns>
    /// <param name="uploadFileDto">The upload model</param>
    /// <response code="200">The file was successfully uploaded</response>
    /// <response code="400">The upload model is invalid</response>
    /// <response code="401">The user unauthorized</response>
    [HttpPost]
    [Consumes("multipart/form-data")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [RequestSizeLimit(int.MaxValue)]
    public async Task<ActionResult<FileInfoDto>> UploadFile([FromForm] UploadFileDto uploadFileDto)
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        CloudFolder? parentFolder = null;
        if (uploadFileDto.FolderId != null)
        {
            parentFolder = await _cloudFoldersProvider.GetFolderAsync(uploadFileDto.FolderId);
            if (parentFolder == null || parentFolder.UserId != user.Id)
            {
                ModelState.AddModelError("", "Folder not found");
                return ValidationProblem(ModelState);
            }
        }

        IFormFile file = uploadFileDto.File;
        string[] segments = file.FileName.Split("/", StringSplitOptions.RemoveEmptyEntries);

        CloudFolder? folder = parentFolder == null
            ? await _cloudFoldersProvider.GetOrCreateFolderByFilePathAsync(
                file.FileName,
                user)
            : await _cloudFoldersProvider.GetOrCreateFolderByFilePathAsync(
                file.FileName,
                parentFolder);

        CloudFileInfo fileInfo = null!;
        string fileName = segments[segments.Length - 1];
        if (folder == null)
        {
            fileInfo = await _cloudFilesProvider.SaveFileAsync(file, fileName, user);
        }
        else
        {
            fileInfo = await _cloudFilesProvider.SaveFileAsync(file, fileName, folder);
        }

        return FileInfoDto.FromModel(fileInfo);
    }

    /// <summary>
    /// Gets a single file
    /// </summary>
    /// <param name="id">The file identifier</param>
    /// <returns>The file</returns>
    /// <response code="200">The file was successfully retrieved</response>
    /// <response code="400">The file identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The file does not exist</response>
    [HttpGet("{id}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFile(string id)
    {
        CloudFileInfo? fileInfo = await _cloudFilesProvider.GetFileInfoAsync(id);
        if (fileInfo == null)
        {
            return NotFound();
        }

        string userId = _userManager.GetUserId(User);
        if (userId != fileInfo.UserId)
        {
            return NotFound();
        }

        Stream stream = _cloudFilesProvider.GetFileStream(fileInfo);
        return File(stream, fileInfo.ContentType);
    }

    /// <summary>
    /// Gets a single file info
    /// </summary>
    /// <param name="id">The file identifier</param>
    /// <returns>The file info</returns>
    /// <response code="200">The file info was successfully retrieved</response>
    /// <response code="400">The file identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The file does not exist</response>
    [HttpGet("{id}/info")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FileInfoDto>> GetFileInfo(string id)
    {
        CloudFileInfo? fileInfo = await _cloudFilesProvider.GetFileInfoAsync(id);
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
    /// Downloads a single file
    /// </summary>
    /// <param name="id">The file identifier</param>
    /// <returns>The file</returns>
    /// <response code="200">The file was successfully retrieved</response>
    /// <response code="400">The file identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The file does not exist</response>
    [HttpGet("{id}/download")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadFile(string id)
    {
        CloudFileInfo? fileInfo = await _cloudFilesProvider.GetFileInfoAsync(id);
        if (fileInfo == null)
        {
            return NotFound();
        }

        string userId = _userManager.GetUserId(User);
        if (userId != fileInfo.UserId)
        {
            return NotFound();
        }

        Stream stream = _cloudFilesProvider.GetFileStream(fileInfo);
        return File(stream, fileInfo.ContentType, fileInfo.Name);
    }

    /// <summary>
    /// Changes a single file
    /// </summary>
    /// <param name="id">The file identifier</param>
    /// <param name="changeFileDto">The change model</param>
    /// <returns>The changed file info</returns>
    /// <response code="200">The file was successfully changed</response>
    /// <response code="400">The file identifier or model is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The file does not exist</response>
    [HttpPatch("{id}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FileInfoDto>> ChangeFile(string id, ChangeFileDto changeFileDto)
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        CloudFileInfo? fileInfo = await _cloudFilesProvider.GetFileInfoAsync(id);
        if (fileInfo == null || user.Id != fileInfo.UserId || fileInfo.IsSystemFile)
        {
            return NotFound();
        }

        if (fileInfo.Name != changeFileDto.Name)
        {
            string? folderId = fileInfo.FolderId;
            CloudFolder? folder = null;
            if (folderId != null)
            {
                folder = await _cloudFoldersProvider.GetFolderAsync(folderId);
                if (folder == null)
                {
                    throw new NullReferenceException(nameof(folder));
                }
            }

            CloudFileInfo? foundFileInfo = folder == null
                ? await _cloudFilesProvider.GetFileInfoByNameAsync(changeFileDto.Name, user)
                : await _cloudFilesProvider.GetFileInfoByNameAsync(changeFileDto.Name, folder);

            if (foundFileInfo != null)
            {
                ModelState.AddModelError(nameof(ChangeFileDto.Name), "A file with the same name already exists");
                return ValidationProblem(ModelState);
            }

            fileInfo.Name = changeFileDto.Name;
            await _cloudFilesProvider.UpdateAsync(fileInfo);
        }

        return FileInfoDto.FromModel(fileInfo);
    }

    /// <summary>
    /// Deletes a single file
    /// </summary>
    /// <param name="id">The file identifier</param>
    /// <returns>No content message</returns>
    /// <response code="204">The file was successfully deleted</response>
    /// <response code="400">The file identifier is invalid</response>
    /// <response code="404">The file does not exists</response>
    [HttpDelete("{id}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FileInfoDto>> DeleteFile(string id)
    {
        string userId = _userManager.GetUserId(User);
        CloudFileInfo? fileInfo = await _cloudFilesProvider.GetFileInfoAsync(id);
        if (fileInfo == null || fileInfo.UserId != userId || fileInfo.IsSystemFile)
        {
            return NotFound();
        }

        await _cloudFilesProvider.DeleteFileAsync(fileInfo);
        return NoContent();
    }
}

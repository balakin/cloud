using CloudApi.Controllers;
using CloudApi.Models;
using CloudApi.Storage;
using CloudApi.V1.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CloudApi.V1.Controllers;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class FoldersController : ControllerBase
{
    private readonly UserManager<CloudUser> _userManager;

    private readonly ICloudFoldersProvider _cloudFoldersProvider;

    private readonly IFolderZipGenerator _folderZipGenerator;

    public FoldersController(
        UserManager<CloudUser> userManager,
        ICloudFoldersProvider cloudFoldersProvider,
        IFolderZipGenerator folderZipGenerator)
    {
        _userManager = userManager;
        _cloudFoldersProvider = cloudFoldersProvider;
        _folderZipGenerator = folderZipGenerator;
    }

    /// <summary>
    /// Creates a single folder
    /// </summary>
    /// <param name="createFolderDto">The folder model</param>
    /// <returns>The created folder</returns>
    /// <response code="201">The folder path was successfully retrieved</response>
    /// <response code="400">The model is invalid</response>
    /// <response code="401">The user unauthorized</response>
    [HttpPost]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<FolderDto>> CreateFolder(CreateFolderDto createFolderDto)
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        CloudFolder? parentFolder = null;
        if (createFolderDto.ParentId != null)
        {
            parentFolder = await _cloudFoldersProvider.GetFolderAsync(createFolderDto.ParentId);
            if (parentFolder == null || parentFolder.UserId != user.Id)
            {
                ModelState.AddModelError("", "Parent folder not found");
                return ValidationProblem(ModelState);
            }
        }

        CloudFolder? foundFolder = parentFolder == null
            ? await _cloudFoldersProvider.GetFolderByNameAsync(createFolderDto.Name, user)
            : await _cloudFoldersProvider.GetFolderByNameAsync(createFolderDto.Name, parentFolder);

        if (foundFolder != null)
        {
            ModelState.AddModelError(nameof(CreateFolderDto.Name), "A folder with the same name already exists");
            return ValidationProblem(ModelState);
        }

        CloudFolder folder = parentFolder == null
            ? await _cloudFoldersProvider.CreateFolderAsync(createFolderDto.Name, user)
            : await _cloudFoldersProvider.CreateFolderAsync(createFolderDto.Name, parentFolder);

        return CreatedAtAction(nameof(GetFolder), new { id = folder.Id }, FolderDto.FromModel(folder));
    }

    /// <summary>
    /// Gets a single folder
    /// </summary>
    /// <param name="id">The folder identifier</param>
    /// <returns>The folder</returns>
    /// <response code="200">The folder was successfully retrieved</response>
    /// <response code="400">The folder identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpGet("{id}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FolderDto>> GetFolder(string id)
    {
        string userId = _userManager.GetUserId(User);
        CloudFolder? folder = await _cloudFoldersProvider.GetFolderAsync(id);
        if (folder == null || folder.UserId != userId)
        {
            return NotFound();
        }

        return FolderDto.FromModel(folder);
    }

    /// <summary>
    /// Gets a children of the user root folder
    /// </summary>
    /// <param name="pagination">The pagination model</param>
    /// <returns>The children of the user root folder</returns>
    /// <response code="200">The children was successfully retrieved</response>
    /// <response code="400">The pagination model is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpGet("@root/children")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FolderChildrenDto>> GetRootChildren([FromQuery] OffsetPaginationDto pagination)
    {
        // TODO: Add max page size to options
        pagination = pagination.Normalize(maxPageSize: 200);
        CloudUser user = await _userManager.GetUserAsync(User);
        CloudFolderChildren children = await _cloudFoldersProvider.GetRootChildrenAsync(
            user,
            pagination.Offset,
            pagination.PageSize);

        return FolderChildrenDto.FromModel(children);
    }

    /// <summary>
    /// Gets a children of a single folder
    /// </summary>
    /// <param name="id">The folder identifier</param>
    /// <param name="pagination">The pagination model</param>
    /// <returns>The children of the folder</returns>
    /// <response code="200">The children was successfully retrieved</response>
    /// <response code="400">The folder identifier or pagination model is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpGet("{id}/children")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FolderChildrenDto>> GetFolderChildren(string id, [FromQuery] OffsetPaginationDto pagination)
    {
        // TODO: Add max page size to options
        pagination = pagination.Normalize(maxPageSize: 200);
        CloudUser user = await _userManager.GetUserAsync(User);

        CloudFolder? folder = await _cloudFoldersProvider.GetFolderAsync(id);
        if (folder == null || folder.UserId != user.Id)
        {
            return NotFound();
        }

        CloudFolderChildren children = await _cloudFoldersProvider.GetFolderChildrenAsync(
            folder,
            pagination.Offset,
            pagination.PageSize);

        return FolderChildrenDto.FromModel(children);
    }

    /// <summary>
    /// Gets a path of a single folder
    /// </summary>
    /// <param name="id">The folder identifier</param>
    /// <returns>The path of the folder</returns>
    /// <response code="200">The folder path was successfully retrieved</response>
    /// <response code="400">The folder identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpGet("{id}/path")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FolderPathDto>> GetFolderPath(string id)
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        CloudFolder? folder = await _cloudFoldersProvider.GetFolderAsync(id);
        if (folder == null || folder.UserId != user.Id)
        {
            return NotFound();
        }

        IEnumerable<CloudFolder> parts = await _cloudFoldersProvider.GetFolderPathPartsAsync(folder);
        return FolderPathDto.FromParts(parts);
    }

    /// <summary>
    /// Downloads a single folder
    /// </summary>
    /// <param name="id">The folder identifier</param>
    /// <returns>The folder</returns>
    /// <response code="200">The folder was successfully retrieved</response>
    /// <response code="400">The folder identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpGet("{id}/download")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadFolder(string id)
    {
        CloudFolder? folder = await _cloudFoldersProvider.GetFolderAsync(id);
        if (folder == null)
        {
            return NotFound();
        }

        string userId = _userManager.GetUserId(User);
        if (userId != folder.UserId)
        {
            return NotFound();
        }

        string fileName = await _folderZipGenerator.GenerateAsync(folder);
        return new TempPhysicalFileResult(fileName, "application/zip")
        {
            FileDownloadName = $"{folder.Name}.zip"
        };
    }

    /// <summary>
    /// Changes a single folder
    /// </summary>
    /// <param name="id">The folder identifier</param>
    /// <param name="changeFolderDto">The change model</param>
    /// <returns>The changed folder</returns>
    /// <response code="200">The folder was successfully changed</response>
    /// <response code="400">The folder identifier or model is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpPatch("{id}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FolderDto>> ChangeFolder(string id, ChangeFolderDto changeFolderDto)
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        CloudFolder? folder = await _cloudFoldersProvider.GetFolderAsync(id);
        if (folder == null || folder.UserId != user.Id)
        {
            return NotFound();
        }

        if (folder.Name != changeFolderDto.Name)
        {
            string? parentId = folder.ParentId;
            CloudFolder? parentFolder = null;
            if (parentId != null)
            {
                parentFolder = await _cloudFoldersProvider.GetFolderAsync(parentId);
                if (parentFolder == null)
                {
                    throw new NullReferenceException(nameof(parentFolder));
                }
            }

            CloudFolder? foundFolder = parentFolder == null
                ? await _cloudFoldersProvider.GetFolderByNameAsync(changeFolderDto.Name, user)
                : await _cloudFoldersProvider.GetFolderByNameAsync(changeFolderDto.Name, parentFolder);

            if (foundFolder != null)
            {
                ModelState.AddModelError(nameof(ChangeFolderDto.Name), "A folder with the same name already exists");
                return ValidationProblem(ModelState);
            }

            folder.Name = changeFolderDto.Name;
            await _cloudFoldersProvider.UpdateAsync(folder);
        }

        return FolderDto.FromModel(folder);
    }

    /// <summary>
    /// Deletes a single folder
    /// </summary>
    /// <param name="id">The folder identifier</param>
    /// <returns>No content message</returns>
    /// <response code="204">The folder was successfully deleted</response>
    /// <response code="400">The folder identifier is invalid</response>
    /// <response code="401">The user unauthorized</response>
    /// <response code="404">The folder does not exist</response>
    [HttpDelete("{id}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteFolder(string id)
    {
        string userId = _userManager.GetUserId(User);
        CloudFolder? folder = await _cloudFoldersProvider.GetFolderAsync(id);
        if (folder == null || folder.UserId != userId)
        {
            return NotFound();
        }

        await _cloudFoldersProvider.DeleteFolderAsync(folder);
        return NoContent();
    }
}

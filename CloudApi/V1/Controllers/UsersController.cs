using CloudApi.Helpers;
using CloudApi.Models;
using CloudApi.Options;
using CloudApi.Storage;
using CloudApi.V1.Dto;
using ImageMagick;
using ImageMagick.ImageOptimizers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace CloudApi.V1.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<CloudUser> _userManager;

    private readonly IStorageProvider _storageProvider;

    private readonly CloudUserOptions _userOptions;

    public UsersController(
        UserManager<CloudUser> userManager,
        IStorageProvider storageProvider,
        IOptions<CloudUserOptions> userOptionsAccessor)
    {
        _userManager = userManager;
        _storageProvider = storageProvider;
        _userOptions = userOptionsAccessor.Value;
    }

    /// <summary>
    /// Returns authorized user.
    /// </summary>
    /// <returns>Authorized user.</returns>
    /// <response code="200">Returns authorized user.</response>
    /// <response code="401">The user unauthorized.</response>
    [HttpGet("@[action]")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDto>> Me()
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            throw new NullReferenceException(nameof(user));
        }

        return UserDto.FromModel(user);
    }

    /// <summary>
    /// Changes user avatar.
    /// </summary>
    /// <param name="changeAvatarDto">New avatar.</param>
    /// <returns>No content.</returns>
    /// <response code="204">Avatar changed.</response>
    /// <response code="400">Invalid new avatar.</response>
    /// <response code="401">The user unauthorized.</response>
    [HttpPut("@me/avatar")]
    [Consumes("multipart/form-data")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangeAvatar([FromForm] ChangeAvatarDto changeAvatarDto)
    {
        IFormFile file = changeAvatarDto.File;
        if (file.Length > _userOptions.Avatar.MaxSize)
        {
            ModelState.AddModelError(
                nameof(changeAvatarDto.File),
                $"Maximum file size exceeded ({BytesConverter.ConvertToString(_userOptions.Avatar.MaxSize)})");
            return ValidationProblem(ModelState);
        }

        if (file.Length > int.MaxValue)
        {
            ModelState.AddModelError(
                nameof(changeAvatarDto.File),
                $"Maximum file size exceeded ({BytesConverter.ConvertToString(int.MaxValue)})");
            return ValidationProblem(ModelState);
        }

        CloudUser user = await _userManager.GetUserAsync(User);
        if (user.AvatarId != null)
        {
            await _storageProvider.DeleteFileAsync(user.AvatarId);
            user.AvatarId = null;
            await _userManager.UpdateAsync(user);
        }

        using MemoryStream memoryStream = new MemoryStream((int)file.Length);
        using (Stream fileStream = file.OpenReadStream())
        {
            await fileStream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
        }

        var imageOptimizer = new ImageOptimizer()
        {
            OptimalCompression = true
        };
        imageOptimizer.Compress(memoryStream);
        memoryStream.Position = 0;

        string avatarId = await _storageProvider.SaveSystemFileAsync(memoryStream, file.FileName, file.ContentType, user.Id);
        user.AvatarId = avatarId;
        await _userManager.UpdateAsync(user);

        return NoContent();
    }

    /// <summary>
    /// Deletes user avatar.
    /// </summary>
    /// <returns>No content.</returns>
    /// <response code="204">User avatar was successfully deleted.</response>
    /// <response code="401">The user unauthorized.</response>
    /// <response code="404">The session wasn't found.</response>
    [HttpDelete("@me/avatar")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAvatar()
    {
        CloudUser user = await _userManager.GetUserAsync(User);
        if (user.AvatarId == null)
        {
            return NotFound();
        }

        await _storageProvider.DeleteFileAsync(user.AvatarId);

        user.AvatarId = null;
        await _userManager.UpdateAsync(user);

        return NoContent();
    }
}

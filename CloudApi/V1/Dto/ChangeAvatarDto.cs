using System.ComponentModel.DataAnnotations;
using CloudApi.Validation;

namespace CloudApi.V1.Dto;

public class ChangeAvatarDto
{
    [FileContentType("image/png, image/jpeg")]
    [Required(ErrorMessage = "Required field")]
    public IFormFile File { get; set; } = null!;
}

using System.ComponentModel.DataAnnotations;

namespace CloudApi.V1.Dto;

public class ChangeAvatarDto
{
    [Required(ErrorMessage = "Required field")]
    public IFormFile File { get; set; } = null!;
}

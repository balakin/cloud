using System.ComponentModel.DataAnnotations;

namespace CloudApi.V1.Dto;

public class ChangePasswordDto
{
    [Required(ErrorMessage = "Required field")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Required field")]
    public string NewPassword { get; set; } = string.Empty;
}

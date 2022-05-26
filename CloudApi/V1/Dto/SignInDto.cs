using System.ComponentModel.DataAnnotations;

namespace CloudApi.V1.Dto;

public class SignInDto
{
    [Required(ErrorMessage = "Required field")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Required field")]
    public string Password { get; set; } = string.Empty;
}

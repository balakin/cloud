using System.ComponentModel.DataAnnotations;
using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class SignUpDto
{
    [Required(ErrorMessage = "Required field")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Required field")]
    public string Password { get; set; } = string.Empty;

    public CloudUser ToModel()
    {
        return new CloudUser()
        {
            UserName = UserName
        };
    }
}

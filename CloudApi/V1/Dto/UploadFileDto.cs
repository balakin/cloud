using System.ComponentModel.DataAnnotations;
using CloudApi.Validation;

namespace CloudApi.V1.Dto;

public class UploadFileDto
{
    [Required(ErrorMessage = "Required field")]
    [FormFileValidator(AllowFullPath = true)]
    public IFormFile File { get; set; } = null!;

    public string? FolderId { get; set; }
}

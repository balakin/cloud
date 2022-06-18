using System.ComponentModel.DataAnnotations;
using CloudApi.Validation;

namespace CloudApi.V1.Dto;

public class ChangeFolderDto
{
    [FileName(ErrorMessage = "The folder name must not contain the following characters: {0}")]
    [MaxLength(255, ErrorMessage = "Max number of characters is 255")]
    [Required(ErrorMessage = "Required field")]
    public string Name { get; set; } = string.Empty;
}

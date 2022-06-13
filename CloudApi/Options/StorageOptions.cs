using System.ComponentModel.DataAnnotations;

namespace CloudApi.Options;

public class StorageOptions
{
    public const string SectionName = "Storage";

    [Required(ErrorMessage = "Required field")]
    public string Path { get; set; } = string.Empty;
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CloudApi.Models;

public class CloudFileInfo
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    public string ContentType { get; set; } = string.Empty;

    public long Size { get; set; } = 0;

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = null!;

    public CloudUser? User { get; set; }

    [ForeignKey(nameof(Folder))]
    public string? FolderId { get; set; }

    public bool IsSystemFile { get; set; }

    public CloudFolder? Folder { get; set; }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CloudApi.Models;

public class CloudFileInfo
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public long Size { get; set; } = 0;

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;

    public CloudUser? User { get; set; }

    [ForeignKey(nameof(Folder))]
    public string? FolderId { get; set; } = string.Empty;

    public CloudFolder? Folder { get; set; }
}

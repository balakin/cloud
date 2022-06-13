using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CloudApi.Models;

public class CloudFolder
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;

    public CloudUser? User { get; set; }

    [ForeignKey(nameof(Parent))]
    public string? ParentId { get; set; } = string.Empty;

    public CloudFolder? Parent { get; set; }

    public virtual ICollection<CloudFileInfo>? FilesInfo { get; set; }

    public virtual ICollection<CloudFolder>? Folders { get; set; }
}

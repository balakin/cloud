using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CloudApi.Models;

[Index(nameof(CloudFolder.Name), IsUnique = true)]
public class CloudFolder
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = null!;

    public CloudUser? User { get; set; }

    [ForeignKey(nameof(Parent))]
    public string? ParentId { get; set; } = null!;

    public CloudFolder? Parent { get; set; }

    public virtual ICollection<CloudFileInfo>? FilesInfo { get; set; }

    public virtual ICollection<CloudFolder>? Folders { get; set; }
}

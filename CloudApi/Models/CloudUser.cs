using Microsoft.AspNetCore.Identity;

namespace CloudApi.Models;

public class CloudUser : IdentityUser
{
    public virtual ICollection<Session>? Sessions { get; set; }

    public virtual ICollection<CloudFolder>? Folders { get; set; }

    public virtual ICollection<CloudFileInfo>? FilesInfo { get; set; }

    public string? AvatarId { get; set; }
}

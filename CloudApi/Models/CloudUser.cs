using Microsoft.AspNetCore.Identity;

namespace CloudApi.Models;

public class CloudUser : IdentityUser
{
    public virtual ICollection<Session>? Sessions { get; set; }
}

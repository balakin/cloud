using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CloudApi.Models;

public class Session
{
    [Key]
    public string Key { get; set; } = string.Empty;

    [MaxLength(2048)]
    public byte[] AuthenticationTicketBytes { get; set; } = null!;

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;

    public CloudUser? User { get; set; }
}

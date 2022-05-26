using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace CloudApi.Models;

public class SessionInfo
{
    public string OperationSystem { get; set; } = string.Empty;

    public string Ip { get; set; } = string.Empty;
}

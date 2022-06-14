using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class UserDto
{
    public string Id { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string? AvatarId { get; set; }

    public static UserDto FromModel(CloudUser user)
    {
        return new UserDto()
        {
            Id = user.Id,
            UserName = user.UserName,
            AvatarId = user.AvatarId
        };
    }
}

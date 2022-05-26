using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class UserDto
{
    public string Id { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public UserDto() { }

    public UserDto(CloudUser user)
    {
        Id = user.Id;
        UserName = user.UserName;
    }
}

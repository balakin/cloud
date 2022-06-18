using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class FolderDto
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public static FolderDto FromModel(CloudFolder folder)
    {
        return new FolderDto()
        {
            Id = folder.Id,
            Name = folder.Name,
        };
    }
}

using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class FolderPathDto
{
    public IEnumerable<FolderDto> Parts { get; set; } = null!;

    public static FolderPathDto FromParts(IEnumerable<CloudFolder> parts)
    {
        return new FolderPathDto()
        {
            Parts = parts.Select((folder) => FolderDto.FromModel(folder))
        };
    }
}

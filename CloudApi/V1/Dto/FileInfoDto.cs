using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class FileInfoDto
{
    public string Name { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long Size { get; set; }

    public static FileInfoDto FromModel(CloudFileInfo fileInfo)
    {
        return new FileInfoDto()
        {
            Name = fileInfo.Name,
            ContentType = fileInfo.ContentType,
            Size = fileInfo.Size,
        };
    }
}

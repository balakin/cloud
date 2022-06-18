using CloudApi.Storage;

namespace CloudApi.V1.Dto;

public class FolderChildrenDto
{
    public IEnumerable<FolderDto> Folders { get; set; } = null!;

    public IEnumerable<FileInfoDto> Files { get; set; } = null!;

    public long Count { get; set; }

    public static FolderChildrenDto FromModel(CloudFolderChildren children)
    {
        return new FolderChildrenDto()
        {
            Folders = children.Folders.Select((folder) => FolderDto.FromModel(folder)),
            Files = children.Files.Select((fileInfo) => FileInfoDto.FromModel(fileInfo)),
            Count = children.Count,
        };
    }
}

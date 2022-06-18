using CloudApi.Models;

namespace CloudApi.Storage;

public class CloudFolderChildren
{
    public IEnumerable<CloudFolder> Folders { get; }

    public IEnumerable<CloudFileInfo> Files { get; }

    public long Count { get; }

    public CloudFolderChildren(
        IEnumerable<CloudFolder> folders,
        IEnumerable<CloudFileInfo> files,
        long count)
    {
        Folders = folders;
        Files = files;
        Count = count;
        if (count < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(count));
        }
    }
}

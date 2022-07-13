using CloudApi.Models;

namespace CloudApi.Storage;

public interface IFolderZipGenerator
{
    public Task<string> GenerateAsync(CloudFolder folder);
}

using CloudApi.Models;

namespace CloudApi.Storage;

public interface ICloudFoldersProvider
{
    public Task<CloudFolder> CreateFolderAsync(string name, CloudUser user);

    public Task<CloudFolder> CreateFolderAsync(string name, CloudFolder parentFolder);

    public Task<CloudFolder?> GetFolderAsync(string id);

    public Task<CloudFolderChildren> GetRootChildrenAsync(
            CloudUser user,
            int offset,
            int pageSize);

    public Task<CloudFolderChildren> GetFolderChildrenAsync(
        CloudFolder folder,
        int offset,
        int pageSize);

    public Task<IEnumerable<CloudFolder>> GetFolderPathPartsAsync(CloudFolder folder);

    public Task UpdateAsync(CloudFolder folder);

    public Task DeleteFolderAsync(CloudFolder folder);

    public Task<CloudFolder?> GetFolderByNameAsync(string name, CloudUser user);

    public Task<CloudFolder?> GetFolderByNameAsync(string name, CloudFolder parentFolder);

    public Task<CloudFolder?> GetOrCreateFolderByFilePathAsync(string path, CloudUser user);

    public Task<CloudFolder> GetOrCreateFolderByFilePathAsync(string path, CloudFolder parentFolder);
}

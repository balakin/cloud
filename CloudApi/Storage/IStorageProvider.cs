using CloudApi.Models;

namespace CloudApi.Storage;

public interface IStorageProvider
{
    public CloudFileInfo? GetFileInfo(string id);

    public Task SaveFileAsync(IFormFile file, string userId, string cloudFolderId);

    public Stream GetFileStream(string id);

    public Task DeleteFileAsync(string id);

    public Task CreateFolderAsync(string name, string userId, string? parentFolderId);

    public Task DeleteFolderAsync(string id);
}

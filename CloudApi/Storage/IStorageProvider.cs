using CloudApi.Models;

namespace CloudApi.Storage;

public interface IStorageProvider
{
    public CloudFileInfo? GetFileInfo(string id);

    public Task<string> SaveFileAsync(IFormFile file, string userId, string? cloudFolderId);

    public Task<string> SaveSystemFileAsync(IFormFile file, string userId);

    public Stream GetFileStream(string id);

    public Task DeleteFileAsync(string id);

    public Task<string> CreateFolderAsync(string name, string userId, string? parentFolderId);

    public Task DeleteFolderAsync(string id);
}

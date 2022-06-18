using CloudApi.Models;

namespace CloudApi.Storage;

public interface ICloudFilesProvider
{
    public Task<CloudFileInfo?> GetFileInfoAsync(string id);

    public Task<CloudFileInfo> SaveFileAsync(IFormFile file, CloudUser user);

    public Task<CloudFileInfo> SaveFileAsync(IFormFile file, CloudFolder cloudFolder);

    public Task<CloudFileInfo> SaveFileAsync(IFormFile file, string name, CloudUser user);

    public Task<CloudFileInfo> SaveFileAsync(IFormFile file, string name, CloudFolder cloudFolder);

    public Task<CloudFileInfo> SaveSystemFileAsync(Stream stream, string name, string contentType, CloudUser user);

    public Stream GetFileStream(CloudFileInfo fileInfo);

    public Task DeleteFileAsync(CloudFileInfo fileInfo);

    public Task UpdateAsync(CloudFileInfo fileInfo);
}

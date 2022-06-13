using CloudApi.Options;
using Microsoft.Extensions.Options;

namespace CloudApi.Storage;

public class CloudFileProvider : ICloudFileProvider
{
    private readonly StorageOptions _storageOptions;

    public CloudFileProvider(IOptions<StorageOptions> storageOptionsAccessor)
    {
        _storageOptions = storageOptionsAccessor.Value;
    }

    public Stream GetFileStream(string id)
    {
        string path = GetFilePath(id);
        return File.OpenRead(path);
    }

    public void DeleteFile(string id)
    {
        string path = GetFilePath(id);
        File.Delete(path);
    }

    public async Task<string> SaveFileAsync(IFormFile file)
    {
        string id = Guid.NewGuid().ToString();
        string path = GetFilePath(id);
        using Stream stream = file.OpenReadStream();
        using FileStream fileStream = File.OpenWrite(path);
        await stream.CopyToAsync(fileStream);
        return id;
    }

    private string GetFilePath(string id)
    {
        return Path.Combine(_storageOptions.Path, id);
    }
}

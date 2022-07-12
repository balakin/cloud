using CloudApi.Database;
using CloudApi.Models;
using CloudApi.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CloudApi.Storage;

public class CloudFilesProvider : ICloudFilesProvider
{
    private readonly DatabaseContext _databaseContext;

    private readonly StorageOptions _storageOptions;

    public CloudFilesProvider(DatabaseContext databaseContext, IOptions<StorageOptions> storageOptionsAccessor)
    {
        _databaseContext = databaseContext;
        _storageOptions = storageOptionsAccessor.Value;
    }

    public async Task<CloudFileInfo?> GetFileInfoAsync(string id)
    {
        return await _databaseContext.FilesInfo.FindAsync(id);
    }

    public async Task<CloudFileInfo?> GetFileInfoByNameAsync(string name, CloudUser user)
    {
        return await _databaseContext.FilesInfo
            .FirstOrDefaultAsync((fileInfo) =>
                !fileInfo.IsSystemFile &&
                fileInfo.FolderId == null &&
                fileInfo.UserId == user.Id &&
                fileInfo.Name == name);
    }

    public async Task<CloudFileInfo?> GetFileInfoByNameAsync(string name, CloudFolder cloudFolder)
    {
        return await _databaseContext.FilesInfo
            .FirstOrDefaultAsync((fileInfo) =>
                !fileInfo.IsSystemFile &&
                fileInfo.FolderId == cloudFolder.Id &&
                fileInfo.Name == name);
    }

    public async Task<CloudFileInfo> SaveFileAsync(IFormFile file, CloudUser user)
    {
        return await SaveFileAsync(file, file.FileName, user);
    }

    public async Task<CloudFileInfo> SaveFileAsync(IFormFile file, string name, CloudUser user)
    {
        using Stream stream = file.OpenReadStream();
        string id = await SaveFileToFileSystemAsync(stream);
        var fileInfo = new CloudFileInfo()
        {
            Id = id,
            Name = name,
            User = user,
            Size = file.Length,
            ContentType = file.ContentType,
            IsSystemFile = false,
        };

        await SaveFileInfo(fileInfo);
        return fileInfo;
    }

    public async Task<CloudFileInfo> SaveFileAsync(IFormFile file, CloudFolder cloudFolder)
    {
        return await SaveFileAsync(file, file.FileName, cloudFolder);
    }

    public async Task<CloudFileInfo> SaveFileAsync(IFormFile file, string name, CloudFolder cloudFolder)
    {
        using Stream stream = file.OpenReadStream();
        string id = await SaveFileToFileSystemAsync(stream);
        var fileInfo = new CloudFileInfo()
        {
            Id = id,
            Name = name,
            UserId = cloudFolder.UserId,
            Folder = cloudFolder,
            Size = file.Length,
            ContentType = file.ContentType,
            IsSystemFile = false,
        };

        await SaveFileInfo(fileInfo);
        return fileInfo;
    }

    public async Task<string> SaveFileToFileSystemAsync(Stream stream)
    {
        string id = Guid.NewGuid().ToString();
        string path = GetFilePath(id);
        using FileStream fileStream = File.OpenWrite(path);
        await stream.CopyToAsync(fileStream);
        return id;
    }

    private async Task SaveFileInfo(CloudFileInfo fileInfo)
    {
        try
        {
            _databaseContext.FilesInfo.Add(fileInfo);
            await _databaseContext.SaveChangesAsync();
        }
        catch (Exception exception)
        {
            DeleteFileFromFileSystem(fileInfo);
            throw new Exception("Database update exception", exception);
        }
    }

    public async Task<CloudFileInfo> SaveSystemFileAsync(Stream stream, string name, string contentType, CloudUser user)
    {
        string id = await SaveFileToFileSystemAsync(stream);
        var fileInfo = new CloudFileInfo()
        {
            Id = id,
            Name = name,
            User = user,
            Size = stream.Length,
            ContentType = contentType,
            IsSystemFile = true,
        };

        await SaveFileInfo(fileInfo);
        return fileInfo;
    }

    public Stream GetFileStream(CloudFileInfo fileInfo)
    {
        string path = GetFilePath(fileInfo.Id);
        return File.OpenRead(path);
    }

    public async Task DeleteFileAsync(CloudFileInfo fileInfo)
    {
        DeleteFileFromFileSystem(fileInfo);
        _databaseContext.FilesInfo.Remove(fileInfo);
        await _databaseContext.SaveChangesAsync();
    }

    private void DeleteFileFromFileSystem(CloudFileInfo fileInfo)
    {
        string path = GetFilePath(fileInfo.Id);
        File.Delete(path);
    }

    public async Task UpdateAsync(CloudFileInfo fileInfo)
    {
        _databaseContext.Attach(fileInfo);
        await _databaseContext.SaveChangesAsync();
    }

    private string GetFilePath(string id)
    {
        return Path.Combine(_storageOptions.Path, id);
    }
}

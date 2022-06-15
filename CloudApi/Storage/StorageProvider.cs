using CloudApi.Database;
using CloudApi.Models;

namespace CloudApi.Storage;

public class StorageProvider : IStorageProvider
{
    private readonly DatabaseContext _databaseContext;

    private readonly ICloudFileProvider _cloudFileProvider;

    public StorageProvider(DatabaseContext databaseContext, ICloudFileProvider cloudFileProvider)
    {
        _databaseContext = databaseContext;
        _cloudFileProvider = cloudFileProvider;
    }

    public CloudFileInfo? GetFileInfo(string id)
    {
        return _databaseContext.FilesInfo.Find(id);
    }

    public Stream GetFileStream(string id)
    {
        return _cloudFileProvider.GetFileStream(id);
    }

    public async Task DeleteFileAsync(string id)
    {
        _cloudFileProvider.DeleteFile(id);
        CloudFileInfo? fileInfo = _databaseContext.FilesInfo.Find(id);
        if (fileInfo != null)
        {
            _databaseContext.FilesInfo.Remove(fileInfo);
            await _databaseContext.SaveChangesAsync();
        }
    }

    public async Task<string> SaveFileAsync(IFormFile file, string userId, string? cloudFolderId)
    {
        using Stream stream = file.OpenReadStream();
        string id = await _cloudFileProvider.SaveFileAsync(stream);
        var fileInfo = new CloudFileInfo()
        {
            Id = id,
            Name = file.FileName,
            FolderId = cloudFolderId,
            UserId = userId,
            Size = file.Length,
            ContentType = file.ContentType,
            IsSystemFile = false,
        };

        await SaveFileInfo(fileInfo);
        return id;
    }

    public async Task<string> SaveSystemFileAsync(Stream stream, string name, string contentType, string userId)
    {
        string id = await _cloudFileProvider.SaveFileAsync(stream);
        var fileInfo = new CloudFileInfo()
        {
            Id = id,
            Name = name,
            UserId = userId,
            Size = stream.Length,
            ContentType = contentType,
            IsSystemFile = true,
        };

        await SaveFileInfo(fileInfo);
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
            _cloudFileProvider.DeleteFile(fileInfo.Id);
            throw new Exception("Database update exception", exception);
        }
    }

    public async Task<string> CreateFolderAsync(string name, string userId, string? parentFolderId)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new NullReferenceException(name);
        }

        string id = Guid.NewGuid().ToString();
        var folder = new CloudFolder()
        {
            Id = id,
            Name = name,
            UserId = userId,
            ParentId = parentFolderId
        };

        _databaseContext.Folders.Add(folder);
        await _databaseContext.SaveChangesAsync();

        return id;
    }

    public async Task DeleteFolderAsync(string id)
    {
        CloudFolder? folder = await _databaseContext.Folders.FindAsync(id);
        if (folder == null)
        {
            return;
        }

        foreach (string fileId in _databaseContext.FilesInfo
            .Where((fileInfo) => fileInfo.FolderId == id)
            .Select((fileInfo) => fileInfo.Id))
        {
            _cloudFileProvider.DeleteFile(fileId);
        }

        _databaseContext.RemoveRange(_databaseContext.FilesInfo.Where((fileInfo) => fileInfo.FolderId == id));
        await _databaseContext.SaveChangesAsync();

        foreach (string folderId in _databaseContext.Folders
            .Where((folderInfo) => folderInfo.ParentId == id)
            .Select((folderInfo) => folderInfo.Id))
        {
            await DeleteFolderAsync(folderId);
        }

        _databaseContext.Folders.Remove(folder);
        await _databaseContext.SaveChangesAsync();
    }
}

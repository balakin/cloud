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

    public async Task SaveFileAsync(IFormFile file, string userId, string cloudFolderId)
    {
        string id = await _cloudFileProvider.SaveFileAsync(file);
        var fileInfo = new CloudFileInfo()
        {
            Id = id,
            Name = file.FileName,
            FolderId = cloudFolderId,
            UserId = userId,
            Size = file.Length,
        };

        try
        {
            _databaseContext.FilesInfo.Add(fileInfo);
            await _databaseContext.SaveChangesAsync();
        }
        catch (Exception exception)
        {
            _cloudFileProvider.DeleteFile(id);
            throw exception;
        }
    }

    public async Task CreateFolderAsync(string name, string userId, string? parentFolderId)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new NullReferenceException(name);
        }

        var folder = new CloudFolder()
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            UserId = userId,
            ParentId = parentFolderId
        };

        _databaseContext.Folders.Add(folder);
        await _databaseContext.SaveChangesAsync();
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

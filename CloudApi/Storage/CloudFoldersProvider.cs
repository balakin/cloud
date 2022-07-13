using System.Linq.Expressions;
using CloudApi.Database;
using CloudApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudApi.Storage;

public class CloudFoldersProvider : ICloudFoldersProvider
{
    private readonly DatabaseContext _databaseContext;

    private readonly ICloudFilesProvider _cloudFilesProvider;

    public CloudFoldersProvider(DatabaseContext databaseContext, ICloudFilesProvider cloudFilesProvider)
    {
        _databaseContext = databaseContext;
        _cloudFilesProvider = cloudFilesProvider;
    }

    public async Task<CloudFolder> CreateFolderAsync(string name, CloudUser user)
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
            User = user,
        };

        _databaseContext.Folders.Add(folder);
        await _databaseContext.SaveChangesAsync();

        return folder;
    }

    public async Task<CloudFolder> CreateFolderAsync(string name, CloudFolder parentFolder)
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
            UserId = parentFolder.UserId,
            Parent = parentFolder
        };

        _databaseContext.Folders.Add(folder);
        await _databaseContext.SaveChangesAsync();

        return folder;
    }

    public async Task DeleteFolderAsync(CloudFolder folder)
    {
        if (folder == null)
        {
            return;
        }

        foreach (CloudFileInfo fileInfo in _databaseContext.FilesInfo
            .Where((fileInfo) => fileInfo.FolderId == folder.Id))
        {
            await _cloudFilesProvider.DeleteFileAsync(fileInfo);
        }

        foreach (CloudFolder childFolder in _databaseContext.Folders
            .Where((folderInfo) => folderInfo.ParentId == folder.Id))
        {
            await DeleteFolderAsync(childFolder);
        }

        _databaseContext.Folders.Remove(folder);
        await _databaseContext.SaveChangesAsync();
    }

    public async Task<CloudFolder?> GetFolderAsync(string id)
    {
        return await _databaseContext.Folders.FindAsync(id);
    }

    public async Task<CloudFolderChildren> GetRootChildrenAsync(
        CloudUser user,
        int offset,
        int pageSize)
    {
        Expression<Func<CloudFolder, bool>> foldersPredicate =
            (CloudFolder folder) => folder.UserId == user.Id && folder.ParentId == null;

        Expression<Func<CloudFileInfo, bool>> filesPredicate =
            (CloudFileInfo fileInfo) =>
                fileInfo.UserId == user.Id && fileInfo.FolderId == null && !fileInfo.IsSystemFile;

        return await GetChildrenAsync(foldersPredicate, filesPredicate, offset, pageSize);
    }

    public async Task<CloudFolderChildren> GetFolderChildrenAsync(
        CloudFolder folder,
        int offset,
        int pageSize)
    {
        Expression<Func<CloudFolder, bool>> foldersPredicate =
            (CloudFolder otherFolder) => otherFolder.ParentId == folder.Id;

        Expression<Func<CloudFileInfo, bool>> filesPredicate =
            (CloudFileInfo fileInfo) =>
                fileInfo.FolderId == folder.Id && !fileInfo.IsSystemFile;

        return await GetChildrenAsync(foldersPredicate, filesPredicate, offset, pageSize);
    }

    private async Task<CloudFolderChildren> GetChildrenAsync(
        Expression<Func<CloudFolder, bool>> foldersPredicate,
        Expression<Func<CloudFileInfo, bool>> filesPredicate,
        int offset,
        int pageSize)
    {
        if (offset < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(offset));
        }

        if (pageSize < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(pageSize));
        }

        int foldersCount = await _databaseContext.Folders
            .Where(foldersPredicate)
            .CountAsync();

        int filesInfoCount = await _databaseContext.FilesInfo
            .Where(filesPredicate)
            .CountAsync();

        IEnumerable<CloudFolder> folders = new CloudFolder[0];
        IEnumerable<CloudFileInfo> filesInfo = new CloudFileInfo[0];
        long count = (long)foldersCount + (long)filesInfoCount;

        int foldersTaken = 0;
        if (offset < foldersCount)
        {
            foldersTaken = Math.Min(pageSize, foldersCount - offset);
            folders = await _databaseContext.Folders
                .Where(foldersPredicate)
                .OrderBy((folder) => folder.Name)
                .Skip(offset)
                .Take(foldersTaken)
                .ToArrayAsync();
        }

        if (pageSize - foldersTaken > 0)
        {
            int filesInfoOffset = Math.Max(offset - foldersCount, 0);
            int filesInfoTaken = Math.Min(pageSize - foldersTaken, filesInfoCount - filesInfoOffset);
            filesInfo = await _databaseContext.FilesInfo
                .Where(filesPredicate)
                .OrderBy((fileInfo) => fileInfo.Name)
                .Skip(filesInfoOffset)
                .Take(filesInfoTaken)
                .ToArrayAsync();
        }

        return new CloudFolderChildren(folders, filesInfo, count);
    }

    public async Task UpdateAsync(CloudFolder folder)
    {
        _databaseContext.Attach(folder);
        await _databaseContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<CloudFolder>> GetFolderPathPartsAsync(CloudFolder folder)
    {
        List<CloudFolder> parts = new List<CloudFolder>();
        CloudFolder? current = folder;
        while (current != null)
        {
            parts.Add(current);
            if (current.ParentId == null)
            {
                current = null;
            }
            else
            {
                CloudFolder? parent = await _databaseContext.Folders.FindAsync(current.ParentId);
                if (parent == null)
                {
                    throw new NullReferenceException(nameof(parent));
                }

                current = parent;
            }
        }

        parts.Reverse();
        return parts;
    }

    public async Task<CloudFolder?> GetFolderByNameAsync(string name, CloudUser user)
    {
        return await _databaseContext.Folders.FirstOrDefaultAsync(
            (folder) => folder.UserId == user.Id && folder.Name == name && folder.ParentId == null);
    }

    public async Task<CloudFolder?> GetFolderByNameAsync(string name, CloudFolder parentFolder)
    {
        return await _databaseContext.Folders.FirstOrDefaultAsync(
            (folder) => folder.Name == name && folder.ParentId == parentFolder.Id);
    }

    public async Task<CloudFolder?> GetOrCreateFolderByFilePathAsync(string path, CloudUser user)
    {
        string[] segments = path.Split("/", StringSplitOptions.RemoveEmptyEntries);
        CloudFolder? folder = null;
        if (segments.Length > 1)
        {
            string folderNameInRoot = segments[0];
            CloudFolder? foundFolderInRoot = await GetFolderByNameAsync(folderNameInRoot, user);
            if (foundFolderInRoot == null)
            {
                folder = await CreateFolderAsync(folderNameInRoot, user);
            }
            else
            {
                folder = foundFolderInRoot;
            }
        }

        for (int i = 1; i < segments.Length - 1; i++)
        {
            string folderName = segments[i];
            CloudFolder? foundFolder = await GetFolderByNameAsync(folderName, folder!);
            if (foundFolder == null)
            {
                folder = await CreateFolderAsync(folderName, folder!);
            }
            else
            {
                folder = foundFolder;
            }
        }

        return folder;
    }

    public async Task<CloudFolder> GetOrCreateFolderByFilePathAsync(string path, CloudFolder parentFolder)
    {
        string[] segments = path.Split("/", StringSplitOptions.RemoveEmptyEntries);
        CloudFolder folder = parentFolder;
        for (int i = 0; i < segments.Length - 1; i++)
        {
            string folderName = segments[i];
            CloudFolder? foundFolder = await GetFolderByNameAsync(folderName, folder);
            if (foundFolder == null)
            {
                folder = await CreateFolderAsync(folderName, folder);
            }
            else
            {
                folder = foundFolder;
            }
        }

        return folder;
    }
}

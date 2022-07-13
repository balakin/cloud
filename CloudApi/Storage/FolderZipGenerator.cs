using System.IO.Compression;
using CloudApi.Database;
using CloudApi.Models;

namespace CloudApi.Storage;

public class FolderZipGenerator : IFolderZipGenerator
{
    private readonly ICloudFoldersProvider _cloudFoldersProvider;

    private readonly ICloudFilesProvider _cloudFilesProvider;

    private readonly DatabaseContext _database;

    public FolderZipGenerator(
        ICloudFoldersProvider cloudFoldersProvider,
        ICloudFilesProvider cloudFilesProvider,
        DatabaseContext database)
    {
        _cloudFoldersProvider = cloudFoldersProvider;
        _cloudFilesProvider = cloudFilesProvider;
        _database = database;
    }

    public async Task<string> GenerateAsync(CloudFolder folder)
    {
        string fileName = Path.GetTempFileName();
        using var stream = new FileStream(fileName, FileMode.Open);
        using var archive = new ZipArchive(stream, ZipArchiveMode.Create, leaveOpen: true);
        await AddFilesAsync(archive, folder);
        return fileName;
    }

    private async Task AddFilesAsync(ZipArchive archive, CloudFolder folder, string? prefix = null)
    {
        foreach (CloudFileInfo fileInfo in _database.FilesInfo
            .Where((fileInfo) => !fileInfo.IsSystemFile && fileInfo.FolderId == folder.Id))
        {
            using Stream stream = _cloudFilesProvider.GetFileStream(fileInfo);
            string entryName = prefix == null ? fileInfo.Name : Path.Combine(prefix, fileInfo.Name);
            ZipArchiveEntry entry = archive.CreateEntry(entryName, CompressionLevel.Fastest);
            using Stream entryStream = entry.Open();
            await stream.CopyToAsync(entryStream);
        }

        foreach (CloudFolder childFolder in _database.Folders
            .Where((childFolder) => childFolder.ParentId == folder.Id))
        {
            string nextPrefix = prefix == null ? childFolder.Name : Path.Combine(prefix, childFolder.Name);
            await AddFilesAsync(archive, childFolder, nextPrefix);
        }
    }
}

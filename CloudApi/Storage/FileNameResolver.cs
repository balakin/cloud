using System.Text.RegularExpressions;
using CloudApi.Models;

namespace CloudApi.Storage;

public class FileNameResolver : IFileNameResolver
{
    private const int MaxLength = 255;

    private readonly Regex _indexedFileNameRegex = new Regex(@"^([^\.]*)\s\((\d+)\)(.*)$");

    private readonly Regex _fileNameRegex = new Regex(@"^([^\.]*)(.*)$");

    private readonly ICloudFilesProvider _cloudFilesProvider;

    public FileNameResolver(ICloudFilesProvider cloudFilesProvider)
    {
        _cloudFilesProvider = cloudFilesProvider;
    }

    public async Task<string?> Resolve(string fileName, CloudUser user)
    {
        if (fileName.Length > MaxLength)
        {
            return null;
        }

        CloudFileInfo? foundFileInfo = await _cloudFilesProvider.GetFileInfoByNameAsync(fileName, user);
        if (foundFileInfo == null)
        {
            return fileName;
        }

        if (_indexedFileNameRegex.IsMatch(fileName))
        {
            Match indexedMatch = _indexedFileNameRegex.Match(fileName);
            bool isSuccess = int.TryParse(indexedMatch.Groups[2].Value, out int index);
            if (!isSuccess)
            {
                index = 0;
            }

            return await Resolve(
                $"{indexedMatch.Groups[1].Value} ({index + 1}){indexedMatch.Groups[3].Value}",
                user);
        }

        Match match = _fileNameRegex.Match(fileName);
        return await Resolve($"{match.Groups[1].Value} (1){match.Groups[2].Value}", user);
    }

    public async Task<string?> Resolve(string fileName, CloudFolder folder)
    {
        if (fileName.Length > MaxLength)
        {
            return null;
        }

        CloudFileInfo? foundFileInfo = await _cloudFilesProvider.GetFileInfoByNameAsync(fileName, folder);
        if (foundFileInfo == null)
        {
            return fileName;
        }

        if (_indexedFileNameRegex.IsMatch(fileName))
        {
            Match indexedMatch = _indexedFileNameRegex.Match(fileName);
            bool isSuccess = int.TryParse(indexedMatch.Groups[2].Value, out int index);
            if (!isSuccess)
            {
                index = 0;
            }

            return await Resolve(
                $"{indexedMatch.Groups[1].Value} ({index + 1}){indexedMatch.Groups[3].Value}",
                folder);
        }

        Match match = _fileNameRegex.Match(fileName);
        return await Resolve($"{match.Groups[1].Value} (1){match.Groups[2].Value}", folder);
    }
}

using CloudApi.Models;

namespace CloudApi.Storage;

public interface IFileNameResolver
{
    public Task<string?> ResolveAsync(string fileName, CloudUser user);

    public Task<string?> ResolveAsync(string fileName, CloudFolder folder);
}

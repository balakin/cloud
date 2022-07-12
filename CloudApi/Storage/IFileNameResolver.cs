using CloudApi.Models;

namespace CloudApi.Storage;

public interface IFileNameResolver
{
    public Task<string?> Resolve(string fileName, CloudUser user);

    public Task<string?> Resolve(string fileName, CloudFolder folder);
}

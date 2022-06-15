namespace CloudApi.Storage;

public interface ICloudFileProvider
{
    public Task<string> SaveFileAsync(Stream stream);

    public Stream GetFileStream(string id);

    public void DeleteFile(string id);
}

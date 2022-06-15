namespace CloudApi.Validation;

public class ContentType
{
    private readonly string _contentType;

    public ContentType(string contentType)
    {
        _contentType = Normalize(contentType);
    }

    public bool Contains(string contentType)
    {
        return _contentType.Split(',').Contains(contentType.ToLower());
    }

    public override string ToString()
    {
        return _contentType;
    }

    public string ToFormattedString()
    {
        string[] parts = _contentType.Split(',');
        return string.Join(", ", parts);
    }

    private static string Normalize(string contentType)
    {
        IEnumerable<string> parts = contentType
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select((part) => part.ToLower());

        return string.Join(",", parts);
    }
}

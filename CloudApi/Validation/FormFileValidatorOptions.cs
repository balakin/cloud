namespace CloudApi.Validation;

public class FormFileValidatorOptions
{
    public bool AllowFullPath { get; set; } = false;

    public ContentType? ContentType { get; set; }
}

namespace CloudApi.Validation;

public interface IFormFileValidator
{
    public bool Validate(IFormFile file, FormFileValidatorOptions options, out string? errorMessage);
}

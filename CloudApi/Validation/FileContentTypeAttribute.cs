using System.ComponentModel.DataAnnotations;

namespace CloudApi.Validation;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = false)]
public class FileContentTypeAttribute : ValidationAttribute
{
    public ContentType ContentType { get; }

    public FileContentTypeAttribute(string contentType)
    {
        ContentType = new ContentType(contentType);
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return ValidationResult.Success;
        }

        if (!(value is IFormFile file))
        {
            throw new ArgumentException("Unsupported type. Attribute only for IFormFile");
        }

        if (ContentType.Contains(file.ContentType))
        {
            return ValidationResult.Success;
        }
        else
        {
            return new ValidationResult("Unsupported content type");
        }
    }
}

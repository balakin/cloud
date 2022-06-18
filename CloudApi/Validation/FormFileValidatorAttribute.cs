using System.ComponentModel.DataAnnotations;

namespace CloudApi.Validation;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = false)]
public sealed class FormFileValidatorAttribute : ValidationAttribute
{
    public bool AllowFullPath { get; set; }

    public string? ContentType { get; set; }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return ValidationResult.Success;
        }

        if (value is IEnumerable<IFormFile> files)
        {
            return ValidateFormFiles(files, validationContext);
        }

        if (value is IFormFile file)
        {
            return ValidateFormFile(file, validationContext);
        }

        throw new ArgumentException("Unsupported type. Attribute only for IFormFile");
    }

    private ValidationResult? ValidateFormFiles(IEnumerable<IFormFile> files, ValidationContext validationContext)
    {
        var formFileValidator = validationContext.GetRequiredService<IFormFileValidator>();
        var options = new FormFileValidatorOptions()
        {
            AllowFullPath = AllowFullPath,
            ContentType = ContentType != null ? new ContentType(ContentType) : null
        };

        foreach (var file in files)
        {
            var result = ValidateFormFile(file, formFileValidator, options);
            if (result != ValidationResult.Success)
            {
                return result;
            }
        }

        return ValidationResult.Success;
    }

    private ValidationResult? ValidateFormFile(IFormFile file, ValidationContext validationContext)
    {
        var formFileValidator = validationContext.GetRequiredService<IFormFileValidator>();
        var options = new FormFileValidatorOptions()
        {
            AllowFullPath = AllowFullPath,
            ContentType = ContentType != null ? new ContentType(ContentType) : null
        };

        return ValidateFormFile(file, formFileValidator, options);
    }

    private ValidationResult? ValidateFormFile(IFormFile file, IFormFileValidator formFileValidator, FormFileValidatorOptions options)
    {
        bool isValid = formFileValidator.Validate(file, options, out string? errorMessage);
        if (isValid)
        {
            return ValidationResult.Success;
        }

        return new ValidationResult(errorMessage);
    }
}

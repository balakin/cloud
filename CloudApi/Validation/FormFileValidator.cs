using System.Text.RegularExpressions;

namespace CloudApi.Validation;

public class FormFileValidator : IFormFileValidator
{
    private const int MaxPathSegmentLength = 255;

    private const string Banned = "\\ / : ? \" < > |";

    private const string Pattern = @"^[^\\/:?""<>|]*$";

    private const string FullPathPattern = @"^[^\\/:?""<>|]*$|^(/[^\\/:?""<>|]+)+$";

    public bool Validate(IFormFile file, FormFileValidatorOptions options, out string? errorMessage)
    {
        if (file == null)
        {
            throw new NullReferenceException(nameof(file));
        }

        if (options.ContentType != null)
        {
            bool isValid = ValidateContentType(file, options.ContentType, out errorMessage);
            if (!isValid)
            {
                return false;
            }
        }

        if (options.AllowFullPath)
        {
            bool isValid = ValidateFileFullPath(file, MaxPathSegmentLength, out errorMessage);
            if (!isValid)
            {
                return false;
            }
        }
        else
        {
            bool isValid = ValidateFileName(file, MaxPathSegmentLength, out errorMessage);
            if (!isValid)
            {
                return false;
            }
        }

        errorMessage = null;
        return true;
    }

    private bool ValidateContentType(IFormFile file, ContentType contentType, out string? errorMessage)
    {
        if (contentType.Contains(file.ContentType))
        {
            errorMessage = null;
            return true;
        }


        errorMessage = $"Unsupported content type.\n Expected: \"{contentType.ToFormattedString()}\".\n Received: \"{file.ContentType}\".\n File: \"{file.FileName}\"";
        return false;
    }

    private bool ValidateFileName(IFormFile file, int maxLength, out string? errorMessage)
    {
        if (!Regex.IsMatch(file.FileName, Pattern))
        {
            errorMessage = $"The file name must not contain the following characters: {Banned}.\n File: \"{file.FileName}\"";
            return false;
        }

        if (file.FileName.Length > maxLength)
        {
            errorMessage = $"Max number of characters in file name is {maxLength}.\n File: \"{file.FileName}\"";
            return false;
        }

        errorMessage = null;
        return true;
    }

    private bool ValidateFileFullPath(IFormFile file, int maxSegmentLength, out string? errorMessage)
    {
        if (!Regex.IsMatch(file.FileName, FullPathPattern))
        {
            errorMessage = $"The file name and folder name must not contain the following characters: {Banned}.\n File: \"{file.FileName}\"";
            return false;
        }

        string[] segments = file.FileName.Split("/", StringSplitOptions.RemoveEmptyEntries);
        for (int i = 0; i < segments.Length; i++)
        {
            if (segments[i].Length > maxSegmentLength)
            {
                string entryName = i + 1 == segments.Length ? "file" : "folder";
                errorMessage = $"Max number of characters in {entryName} name is {maxSegmentLength}.\n File: \"{file.FileName}\"";
                return false;
            }
        }

        errorMessage = null;
        return true;
    }
}

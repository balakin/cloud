using System.ComponentModel.DataAnnotations;

namespace CloudApi.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter, AllowMultiple = false, Inherited = true)]
public class FileNameAttribute : RegularExpressionAttribute
{
    public FileNameAttribute() : base(@"^[^\\/:?""<>|]*$") { }

    public override string FormatErrorMessage(string name)
    {
        return string.Format(ErrorMessage ?? "Incorrect file name", "\\ / : ? \" < > |");
    }
}

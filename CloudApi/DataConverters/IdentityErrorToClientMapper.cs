using Microsoft.AspNetCore.Identity;

namespace CloudApi.DataConverters;

public class IdentityErrorToClientMapper
{
    public class Error
    {
        public string FieldName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public static Error UserName(IdentityError error)
        {
            return new Error()
            {
                FieldName = "UserName",
                Description = error.Description.TrimEnd('.')
            };
        }

        public static Error Email(IdentityError error)
        {
            return new Error()
            {
                FieldName = "Email",
                Description = error.Description.TrimEnd('.')
            };
        }

        public static Error Password(IdentityError error)
        {
            return new Error()
            {
                FieldName = "Password",
                Description = error.Description.TrimEnd('.')
            };
        }
    }

    public Error Map(IdentityError error)
    {
        switch (error.Code)
        {
            case nameof(IdentityErrorDescriber.InvalidUserName):
            case nameof(IdentityErrorDescriber.DuplicateUserName):
                return Error.UserName(error);
            case nameof(IdentityErrorDescriber.InvalidEmail):
            case nameof(IdentityErrorDescriber.DuplicateEmail):
                return Error.Email(error);
            case nameof(IdentityErrorDescriber.PasswordRequiresDigit):
            case nameof(IdentityErrorDescriber.PasswordRequiresLower):
            case nameof(IdentityErrorDescriber.PasswordRequiresNonAlphanumeric):
            case nameof(IdentityErrorDescriber.PasswordRequiresUniqueChars):
            case nameof(IdentityErrorDescriber.PasswordRequiresUpper):
            case nameof(IdentityErrorDescriber.PasswordTooShort):
                return Error.Password(error);
            default:
                throw new NotImplementedException(error.Code);
        }
    }
}

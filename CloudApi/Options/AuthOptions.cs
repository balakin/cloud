namespace CloudApi.Options;

public class AuthOptions
{
    public const string SectionName = "Auth";

    public string SessionCookieName { get; set; } = "SESSIONID";
}

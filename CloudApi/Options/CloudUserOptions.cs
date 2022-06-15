namespace CloudApi.Options;

public class CloudUserOptions
{
    public class AvatarOptions
    {
        public int MaxSize { get; set; } = 5 * 1024 * 1024; // 5 MB
    }

    public const string SectionName = "User";

    public AvatarOptions Avatar { get; set; } = new AvatarOptions();
}

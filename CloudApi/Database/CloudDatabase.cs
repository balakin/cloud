using Microsoft.EntityFrameworkCore;

namespace CloudApi.Database;

public class CloudDatabase : DbContext
{
    public CloudDatabase(DbContextOptions<CloudDatabase> options)
        : base(options) { }
}

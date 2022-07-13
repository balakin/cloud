using Microsoft.EntityFrameworkCore;

namespace CloudApi.Database;

public class PostgresDatabaseContext : DatabaseContext
{
    public PostgresDatabaseContext()
        : base(new DbContextOptionsBuilder<DatabaseContext>().UseNpgsql("stub").Options) { }
}

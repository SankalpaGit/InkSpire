using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<MemberModel> Members { get; set; }
    public DbSet<StaffModel> Staffs { get; set; }
    public DbSet<AdminModel> Admins { get; set; }
    public DbSet<BookModel> Books { get; set; }
    public DbSet<BookmarkModel> Bookmarks { get; set; }
    public DbSet<SaleModel> Sales { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure MemberModel.Id as a non-identity column

        modelBuilder.Entity<MemberModel>()
            .Property(m => m.Id)
            .ValueGeneratedNever(); // Prevents the database from treating it as an identity column
    }
}
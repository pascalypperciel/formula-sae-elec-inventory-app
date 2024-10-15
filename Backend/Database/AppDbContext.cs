using backend.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Item> Items { get; set; }
    public DbSet<ItemHistory> ItemHistories { get; set; }
    public DbSet<ShoppingCart> ShoppingCarts { get; set; }
    public DbSet<Vendor> Vendors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Item>()
            .HasOne(i => i.Vendor)
            .WithMany(v => v.Items)
            .HasForeignKey(i => i.VendorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ItemHistory>()
            .HasOne(h => h.Item)
            .WithMany(i => i.History)
            .HasForeignKey(h => h.ItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

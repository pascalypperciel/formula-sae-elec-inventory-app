using Microsoft.EntityFrameworkCore;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _context;

    public ItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Item>> GetItemsAsync()
    {
        return await _context.Items.ToListAsync();
    }

    public async Task<Item> GetItemByIdAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null)
        {
            throw new NullReferenceException("Item not found");
        }
        return item;
    }

    public async Task AddItemAsync(Item item)
    {
        await _context.Items.AddAsync(item);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateItemAsync(Item item)
    {
        _context.Items.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteItemAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item != null)
        {
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}

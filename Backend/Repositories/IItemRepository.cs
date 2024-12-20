public interface IItemRepository
{
    Task<List<Item>> GetItemsAsync();
    Task<Item?> GetItemByIdAsync(int id);
    Task AddItemAsync(Item item);
    Task AddItemsAsync(IEnumerable<Item> items);
    Task UpdateItemAsync(Item item);
    Task DeleteItemAsync(int id);
}

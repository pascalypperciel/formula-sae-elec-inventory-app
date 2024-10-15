public interface IItemService
{
    Task<List<ItemDTO>> GetItemsAsync();
    Task AddItemAsync(ItemDTO itemDto);
    Task AddItemsAsync(IEnumerable<Item> items);
    Task UpdateItemAsync(int id, ItemDTO itemDto);
    Task DeleteItemAsync(int id);
}

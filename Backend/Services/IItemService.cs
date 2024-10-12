public interface IItemService
{
    Task<List<ItemDto>> GetItemsAsync();
    Task AddItemAsync(ItemDto itemDto);
    Task UpdateItemAsync(int id, ItemDto itemDto);
    Task DeleteItemAsync(int id);
}

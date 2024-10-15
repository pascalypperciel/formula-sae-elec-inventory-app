using AutoMapper;
using Microsoft.EntityFrameworkCore;

public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;
    private readonly IMapper _mapper;

    public ItemService(IItemRepository itemRepository, IMapper mapper)
    {
        _itemRepository = itemRepository;
        _mapper = mapper;
    }

    public async Task<List<ItemDTO>> GetItemsAsync()
    {
        var items = await _itemRepository.GetItemsAsync();
        return _mapper.Map<List<ItemDTO>>(items);
    }

    public async Task AddItemAsync(ItemDTO itemDto)
    {
        var item = _mapper.Map<Item>(itemDto);
        await _itemRepository.AddItemAsync(item);
    }

    public async Task AddItemsAsync(IEnumerable<Item> items)
    {
        await _itemRepository.AddItemsAsync(items);
    }

    public async Task UpdateItemAsync(int id, ItemDTO itemDto)
    {
        var item = await _itemRepository.GetItemByIdAsync(id);
        if (item == null) return;

        _mapper.Map(itemDto, item);
        await _itemRepository.UpdateItemAsync(item);
    }

    public async Task DeleteItemAsync(int id)
    {
        await _itemRepository.DeleteItemAsync(id);
    }
}

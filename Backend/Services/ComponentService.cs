using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Microsoft.EntityFrameworkCore;

public class ComponentService : IComponentService
{
    private readonly IComponentRepository _componentRepository;
    private readonly IItemRepository _itemRepository;
    private readonly IMapper _mapper;

    public ComponentService(IComponentRepository componentRepository, IItemRepository itemRepository, IMapper mapper)
    {
        _componentRepository = componentRepository;
        _itemRepository = itemRepository;
        _mapper = mapper;
    }

    public async Task<List<ComponentDTO>> GetComponentsAsync()
    {
        var components = await _componentRepository.GetComponentsAsync();
        return _mapper.Map<List<ComponentDTO>>(components);
    }

    public async Task<ComponentDTO?> GetComponentByIdAsync(int id)
    {
        var component = await _componentRepository.GetComponentByIdAsync(id);
        if (component == null) return null;

        return new ComponentDTO
        {
            Id = component.Id,
            Name = component.Name,
            Description = component.Description,
            ComponentItems = component.ComponentItems.Select(ci => new ComponentItemDTO
            {
                ItemId = ci.ItemId,
                Identifier = ci.Item.Identifier,
                QuantityRequired = ci.QuantityRequired,
                AvailableQuantity = ci.Item.Quantity,
                VendorId = ci.Item.VendorId,
                ImageUrl = ci.Item.ImageUrl
            }).ToList()
        };
    }

    public async Task AddComponentAsync(ComponentDTO componentDto)
    {
        var component = _mapper.Map<Component>(componentDto);
        await _componentRepository.AddComponentAsync(component);
    }

    public async Task UpdateComponentAsync(int id, ComponentDTO componentDto)
    {
        var component = new Component
        {
            Id = id,
            Name = componentDto.Name,
            Description = componentDto.Description,
            ComponentItems = new List<ComponentItem>()
        };

        foreach (var ci in componentDto.ComponentItems)
        {
            var item = await _itemRepository.GetItemByIdAsync(ci.ItemId);
            if (item == null)
            {
                throw new Exception($"Item with ID {ci.ItemId} does not exist.");
            }

            component.ComponentItems.Add(new ComponentItem
            {
                ItemId = ci.ItemId,
                Item = item,
                Component = component,
                QuantityRequired = ci.QuantityRequired
            });
        }

        await _componentRepository.UpdateComponentAsync(component);
    }

    public async Task DeleteComponentAsync(int id)
    {
        await _componentRepository.DeleteComponentAsync(id);
    }

    public async Task<int> GetBuildableQuantityAsync(int componentId)
    {
        var component = await _componentRepository.GetComponentByIdAsync(componentId);
        if (component == null) throw new Exception("Component not found.");

        var buildableQuantities = component.ComponentItems
            .Select(async ci =>
            {
                var item = await _itemRepository.GetItemByIdAsync(ci.ItemId);
                return item != null ? item.Quantity / ci.QuantityRequired : 0;
            });

        return (await Task.WhenAll(buildableQuantities)).Min();
    }

    public async Task<List<ItemDTO>> GetNeededItemsForBuildAsync(int componentId, int quantityToBuild)
    {
        var component = await _componentRepository.GetComponentByIdAsync(componentId);
        if (component == null) throw new Exception("Component not found.");

        var neededItems = new List<ItemDTO>();

        foreach (var ci in component.ComponentItems)
        {
            var item = await _itemRepository.GetItemByIdAsync(ci.ItemId);
            if (item != null)
            {
                var totalNeeded = ci.QuantityRequired * quantityToBuild;
                if (totalNeeded > item.Quantity)
                {
                    var neededItem = new ItemDTO
                    {
                        Id = item.Id,
                        Identifier = item.Identifier,
                        Category = item.Category,
                        Name = item.Name ?? "Unknown",
                        Vendor = new VendorDTO
                        {
                            Id = item.Vendor.Id,
                            Name = item.Vendor.Name
                        },
                        Quantity = totalNeeded - item.Quantity,
                        LastOrderDate = item.LastOrderDate ?? DateTime.MinValue,
                        Link = item.Link,
                        Location = item.Location,
                        Description = item.Description,
                        CostPerItem = item.CostPerItem,
                        ReorderLevel = item.ReorderLevel,
                        ReorderQuantity = item.ReorderQuantity,
                        ImageUrl = item.ImageUrl,
                        Discontinued = item.Discontinued
                    };
                    neededItems.Add(neededItem);
                }
            }
        }

        return neededItems;
    }
}

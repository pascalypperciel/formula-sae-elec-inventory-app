using backend.Models;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

public class ComponentRepository : IComponentRepository
{
    private readonly AppDbContext _context;

    public ComponentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Component>> GetComponentsAsync()
    {
        return await _context.Components
            .Include(c => c.ComponentItems)
            .ThenInclude(ci => ci.Item)
            .ToListAsync();
    }

    public async Task<Component?> GetComponentByIdAsync(int id)
    {
        return await _context.Components
            .Include(c => c.ComponentItems)
            .ThenInclude(ci => ci.Item)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddComponentAsync(Component component)
    {
        foreach (var componentItem in component.ComponentItems)
        {
            var existingItem = await _context.Items.FindAsync(componentItem.ItemId);
            if (existingItem == null)
            {
                throw new Exception($"Item with ID {componentItem.ItemId} does not exist.");
            }

            componentItem.Item = existingItem;
        }

        await _context.Components.AddAsync(component);
        await _context.SaveChangesAsync();
    }


    public async Task UpdateComponentAsync(Component component)
    {
        var existingComponent = await _context.Components
            .Include(c => c.ComponentItems)
            .FirstOrDefaultAsync(c => c.Id == component.Id);

        if (existingComponent == null)
        {
            throw new Exception($"Component with ID {component.Id} not found.");
        }

        existingComponent.Name = component.Name;

        _context.ComponentItems.RemoveRange(existingComponent.ComponentItems);

        foreach (var newItem in component.ComponentItems)
        {
            var existingItem = await _context.Items.FindAsync(newItem.ItemId);
            if (existingItem == null)
            {
                throw new Exception($"Item with ID {newItem.ItemId} does not exist.");
            }

            newItem.Item = existingItem;
            existingComponent.ComponentItems.Add(newItem);
        }

        _context.Components.Update(existingComponent);
        await _context.SaveChangesAsync();
    }


    public async Task DeleteComponentAsync(int id)
    {
        var component = await _context.Components.FindAsync(id);
        if (component != null)
        {
            _context.Components.Remove(component);
            await _context.SaveChangesAsync();
        }
    }
}

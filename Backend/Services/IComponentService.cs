using backend.DTOs;

namespace backend.Services
{
    public interface IComponentService
    {
        Task<List<ComponentDTO>> GetComponentsAsync();
        Task AddComponentAsync(ComponentDTO componentDto);
        Task UpdateComponentAsync(int id, ComponentDTO componentDto);
        Task DeleteComponentAsync(int id);
        Task<int> GetBuildableQuantityAsync(int componentId);
        Task<List<ItemDTO>> GetNeededItemsForBuildAsync(int componentId, int quantityToBuild);
    }
}

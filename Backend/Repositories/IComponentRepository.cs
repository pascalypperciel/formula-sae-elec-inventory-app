using backend.Models;

namespace backend.Repositories
{
    public interface IComponentRepository
    {
        Task<List<Component>> GetComponentsAsync();
        Task<Component?> GetComponentByIdAsync(int id);
        Task AddComponentAsync(Component component);
        Task UpdateComponentAsync(Component component);
        Task DeleteComponentAsync(int id);
    }

}

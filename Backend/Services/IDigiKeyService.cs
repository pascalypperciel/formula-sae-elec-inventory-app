using backend.Models.DigiKey;

namespace backend.Services
{
    public interface IDigiKeyService
    {
        Task<string> GetAccessToken();
        Task<string> GetDigiKeyProductPricing(string partNumber);
        Task<string> CreateOrder(OrderRequest orderRequest);
    }
}

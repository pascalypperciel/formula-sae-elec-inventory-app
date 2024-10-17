namespace backend.Services
{
    public interface IDigiKeyService
    {
        Task<string> GetAccessToken();
        Task<string> GetDigiKeyProductPricing(string partNumber);
    }
}

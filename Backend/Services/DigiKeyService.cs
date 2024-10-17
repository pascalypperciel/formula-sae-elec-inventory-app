using System.Text;
using backend.Services;
using Newtonsoft.Json.Linq;

public class DigiKeyService : IDigiKeyService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public DigiKeyService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GetAccessToken()
    {
        var clientId = _configuration["DigiKey:ClientId"];
        var clientSecret = _configuration["DigiKey:ClientSecret"];
        var tokenEndpoint = _configuration["DigiKey:TokenEndpoint"];

        var content = new StringContent(
            $"client_id={clientId}&client_secret={clientSecret}&grant_type=client_credentials",
            Encoding.UTF8, "application/x-www-form-urlencoded"
        );

        var response = await _httpClient.PostAsync(tokenEndpoint, content);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        var access_token = JObject.Parse(responseBody)["access_token"];

        if (access_token == null)
            throw new Exception("Failed to retrieve access token from DigiKey API.");

        var token = access_token.ToString();

        return token;
    }

    public async Task<string> GetDigiKeyProductPricing(string partNumber)
    {
        var token = await GetAccessToken();
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://sandbox-api.digikey.com/products/v4/{partNumber}/pricing");

        request.Headers.Add("Authorization", $"Bearer {token}");
        request.Headers.Add("X-DIGIKEY-Client-Id", _configuration["DigiKey:ClientId"]);
        request.Headers.Add("X-DIGIKEY-Locale-Site", "US");
        request.Headers.Add("X-DIGIKEY-Locale-Language", "en");
        request.Headers.Add("X-DIGIKEY-Locale-Currency", "USD");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync();
    }
}


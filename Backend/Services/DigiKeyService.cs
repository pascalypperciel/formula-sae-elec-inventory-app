using System.Net.Http.Headers;
using System.Text;
using backend.Models.DigiKey;
using backend.Services;
using Newtonsoft.Json;
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
        try
        {
            var token = await GetAccessToken();
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://sandbox-api.digikey.com/products/v4/search/{partNumber}/pricing");

            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("X-DIGIKEY-Client-Id", _configuration["DigiKey:ClientId"]);
            request.Headers.Add("X-DIGIKEY-Locale-Site", "CA");
            request.Headers.Add("X-DIGIKEY-Locale-Language", "en");
            request.Headers.Add("X-DIGIKEY-Locale-Currency", "CAD");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
        catch (HttpRequestException ex)
        {
            throw new Exception($"Error fetching product pricing: {ex.Message}");
        }
    }

    public async Task<string> CreateOrder(OrderRequest orderRequest)
    {
        try
        {
            var token = await GetAccessToken();
            var request = new HttpRequestMessage(HttpMethod.Post, $"https://sandbox-api.digikey.com/Ordering/v3/Orders");

            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("X-DIGIKEY-Client-Id", _configuration["DigiKey:ClientId"]);
            request.Content = new StringContent(JsonConvert.SerializeObject(orderRequest), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Error creating order: Status Code {response.StatusCode}, Response: {responseBody}");
            }

            return responseBody;
        }
        catch (HttpRequestException ex)
        {
            throw new Exception($"Error creating order (HttpRequestException): {ex.Message}");
        }
        catch (Exception ex)
        {
            throw new Exception($"Unexpected error creating order: {ex.Message}");
        }
    }

}


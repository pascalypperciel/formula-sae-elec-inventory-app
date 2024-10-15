using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DigiKeyController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public DigiKeyController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // GET

        [HttpGet("products")]
        public async Task<IActionResult> GetDigiKeyProducts()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://api.example.com/products");

            request.Headers.Add("Authorization", "Bearer YOUR_API_KEY");

            try
            {
                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, "Failed to retrieve products.");

                var data = await response.Content.ReadAsStringAsync();
                return Content(data, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }

}

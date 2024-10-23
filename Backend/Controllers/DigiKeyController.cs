using backend.Models.DigiKey;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DigiKeyController : ControllerBase
    {
        private readonly DigiKeyService _digiKeyService;

        public DigiKeyController(DigiKeyService digiKeyService)
        {
            _digiKeyService = digiKeyService;
        }

        // GET
        [HttpGet("pricing/{partNumber}")]
        public async Task<IActionResult> GetProductPricing(string partNumber)
        {
            try
            {
                var pricingData = await _digiKeyService.GetDigiKeyProductPricing(partNumber);
                return Content(pricingData, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        // POST
        [HttpPost("order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest orderRequest)
        {
            try
            {
                var orderResponse = await _digiKeyService.CreateOrder(orderRequest);
                return Content(orderResponse, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}

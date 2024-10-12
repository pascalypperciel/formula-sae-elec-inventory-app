using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public async Task<IActionResult> GetItems()
    {
        var items = await _itemService.GetItemsAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> AddItem([FromBody] ItemDto itemDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _itemService.AddItemAsync(itemDto);
        return CreatedAtAction(nameof(GetItems), new { name = itemDto.Name }, itemDto);
    }
}

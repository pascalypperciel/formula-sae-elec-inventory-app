using AutoMapper;
using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;
    private readonly IMapper _mapper;
    private readonly AppDbContext _context;

    public ItemsController(IItemService itemService, IMapper mapper, AppDbContext context)
    {
        _itemService = itemService;
        _mapper = mapper;
        _context = context;
    }

    // GET
    [HttpGet]
    public async Task<IActionResult> GetItems()
    {
        var items = await _context.Items.ToListAsync();
        Console.WriteLine($"Retrieved {items.Count} items from the database.");
        return Ok(items);
    }

    // POST
    [HttpPost("upload")]
    public async Task<IActionResult> UploadItems([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload a valid CSV file.");

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            string? line;
            bool isHeader = true;
            var newItems = new List<Item>();
            var identifiers = new HashSet<string>(); // Track identifiers to detect duplicates

            while ((line = await reader.ReadLineAsync()) != null)
            {
                if (isHeader)
                {
                    isHeader = false;
                    continue;
                }

                var values = line.Split(',');
                var identifier = values.ElementAtOrDefault(0)?.Trim();

                if (string.IsNullOrWhiteSpace(identifier) || identifiers.Contains(identifier))
                    continue; // Skip invalid or duplicate entries

                identifiers.Add(identifier);

                var newItem = new Item
                {
                    Identifier = identifier,
                    Category = values.ElementAtOrDefault(1)?.Trim() ?? "Other",
                    Vendor = values.ElementAtOrDefault(4)?.Trim() ?? "Unknown",
                    LastOrderDate = ParseDate(values.ElementAtOrDefault(2)) ?? DateTime.MinValue,
                    Name = values.ElementAtOrDefault(3) ?? "Unnamed Item",
                    Link = string.IsNullOrWhiteSpace(values.ElementAtOrDefault(5)) ? null : values[5],
                    Location = string.IsNullOrWhiteSpace(values.ElementAtOrDefault(6)) ? null : values[6],
                    Description = string.IsNullOrWhiteSpace(values.ElementAtOrDefault(7)) ? null : values[7],
                    CostPerItem = ParseDouble(values.ElementAtOrDefault(8)),
                    Quantity = ParseInt(values.ElementAtOrDefault(9)),
                    TotalValue = ParseDouble(values.ElementAtOrDefault(10)),
                    ReorderLevel = ParseInt(values.ElementAtOrDefault(11)),
                    ReorderQuantity = ParseInt(values.ElementAtOrDefault(12)),
                    Discontinued = ParseBool(values.ElementAtOrDefault(13))
                };

                newItems.Add(newItem);
            }

            if (newItems.Any())
            {
                await _context.BulkInsertAsync(newItems); // Use BulkExtensions for performance
            }

            await _context.SaveChangesAsync();
            return Ok("Items uploaded and saved successfully.");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error saving items: {ex.Message}");
        }
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] Item updatedItem)
    {
        if (id != updatedItem.Id)
            return BadRequest("Item ID mismatch.");

        var existingItem = await _context.Items.FindAsync(id);
        if (existingItem == null)
            return NotFound("Item not found.");

        // Update the existing item's fields
        existingItem.Identifier = updatedItem.Identifier;
        existingItem.Name = updatedItem.Name;
        existingItem.Category = updatedItem.Category;
        existingItem.Vendor = updatedItem.Vendor;
        existingItem.Quantity = updatedItem.Quantity;
        existingItem.CostPerItem = updatedItem.CostPerItem;
        existingItem.LastOrderDate = updatedItem.LastOrderDate;
        existingItem.Link = updatedItem.Link;
        existingItem.Location = updatedItem.Location;
        existingItem.Description = updatedItem.Description;
        existingItem.TotalValue = updatedItem.TotalValue;
        existingItem.ReorderLevel = updatedItem.ReorderLevel;
        existingItem.ReorderQuantity = updatedItem.ReorderQuantity;
        existingItem.Discontinued = updatedItem.Discontinued;

        await _context.SaveChangesAsync();
        return Ok("Item updated successfully.");
    }

    // Helper Methods
    private int ParseInt(string? input) => int.TryParse(input, out var result) ? result : 0;
    private double ParseDouble(string? input) => double.TryParse(input, out var result) ? result : 0.0;
    private DateTime? ParseDate(string? input) => DateTime.TryParse(input, out var result) ? result : (DateTime?)null;
    private bool ParseBool(string? input) => input?.Trim().ToLower() == "yes";
}

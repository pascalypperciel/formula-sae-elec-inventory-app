using AutoMapper;
using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
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

    [HttpGet("export")]
    public async Task<IActionResult> ExportItems()
    {
        var items = await _context.Items.ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Id,Identifier,Category,Vendor,Name,Quantity,CostPerItem,ReorderLevel,ReorderQuantity,Discontinued,LastOrderDate,Link,Location,Description,CreatedAt");

        foreach (var item in items)
        {
            string identifier = item.Identifier;
            string name = item.Name ?? "";
            string category = item.Category;
            string vendor = item.Vendor;
            string description = item.Description ?? "";
            string location = item.Location ?? "";
            string link = item.Link ?? "";

            csv.AppendLine(
                $"{item.Id},{EscapeCsvField(identifier)},{EscapeCsvField(category)},{EscapeCsvField(vendor)}," +
                $"{EscapeCsvField(name)},{item.Quantity},{item.CostPerItem}," +
                $"{item.ReorderLevel},{item.ReorderQuantity},{item.Discontinued}," +
                $"{item.LastOrderDate:yyyy-MM-dd},{EscapeCsvField(link)},{EscapeCsvField(location)}," +
                $"{EscapeCsvField(description)},{item.CreatedAt:yyyy-MM-dd HH:mm:ss}"
            );
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        return File(bytes, "text/csv", "items.csv");
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
        existingItem.ReorderLevel = updatedItem.ReorderLevel;
        existingItem.ReorderQuantity = updatedItem.ReorderQuantity;
        existingItem.Discontinued = updatedItem.Discontinued;
        existingItem.ImageUrl = updatedItem.ImageUrl;

        await _context.SaveChangesAsync();
        return Ok("Item updated successfully.");
    }

    // Helper Methods
    private int ParseInt(string? input) => int.TryParse(input, out var result) ? result : 0;
    private double ParseDouble(string? input) => double.TryParse(input, out var result) ? result : 0.0;
    private DateTime? ParseDate(string? input) => DateTime.TryParse(input, out var result) ? result : (DateTime?)null;
    private bool ParseBool(string? input) => input?.Trim().ToLower() == "yes";
    private string EscapeCsvField(string field)
    {
        if (field.Contains(",") || field.Contains("\""))
        {
            field = field.Replace("\"", "\"\"");
            return $"\"{field}\"";
        }
        return field;
    }
}

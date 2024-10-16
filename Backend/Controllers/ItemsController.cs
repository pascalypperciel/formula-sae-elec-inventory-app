using AutoMapper;
using backend.DTOs;
using backend.Models;
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
        var items = await _context.Items
            .Include(i => i.Vendor)
            .Select(i => new ItemDTO
            {
                Id = i.Id,
                Identifier = i.Identifier,
                Category = i.Category,
                LastOrderDate = i.LastOrderDate ?? DateTime.MinValue,
                Name = i.Name ?? string.Empty,
                Link = i.Link,
                Location = i.Location,
                Description = i.Description,
                CostPerItem = i.CostPerItem,
                Quantity = i.Quantity,
                ReorderLevel = i.ReorderLevel,
                ReorderQuantity = i.ReorderQuantity,
                ImageUrl = i.ImageUrl,
                Discontinued = i.Discontinued,
                Vendor = new VendorDTO
                {
                    Id = i.Vendor.Id,
                    Name = i.Vendor.Name
                }
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportItems()
    {
        var items = await _context.Items
            .Include(i => i.Vendor)
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Id,Identifier,Category,Vendor,Name,Quantity,CostPerItem,ReorderLevel,ReorderQuantity,Discontinued,LastOrderDate,Link,Location,Description,CreatedAt");

        foreach (var item in items)
        {
            string identifier = item.Identifier;
            string name = item.Name ?? "";
            string category = item.Category;
            string vendor = item.Vendor?.Name ?? "Unknown";
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

    [HttpGet("history")]
    public async Task<IActionResult> GetItemHistory()
    {
        var history = await _context.ItemHistories
            .Join(
                _context.Items,
                history => history.ItemId,
                item => item.Id,
                (history, item) => new
                {
                    history.Id,
                    ItemId = history.ItemId,
                    ItemIdentifier = item.Identifier,
                    AmountChanged = history.AmountChanged,
                    NewQuantity = history.NewQuantity,
                    Timestamp = history.Timestamp
                }
            )
            .OrderByDescending(h => h.Timestamp)
            .ToListAsync();

        return Ok(history);
    }

    // POST
    [HttpPost]
    public async Task<IActionResult> CreateItem([FromBody] CreateItemDTO newItemDTO)
    {
        try
        {
            if (newItemDTO == null)
            {
                return BadRequest("Invalid item data.");
            }

            var vendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.Name == newItemDTO.VendorName);

            if (vendor == null)
            {
                vendor = new Vendor { Name = newItemDTO.VendorName };
                _context.Vendors.Add(vendor);
                await _context.SaveChangesAsync();
            }

            var newItem = new Item
            {
                Identifier = newItemDTO.Identifier,
                Category = newItemDTO.Category,
                Quantity = newItemDTO.Quantity,
                Description = newItemDTO.Description,
                Location = newItemDTO.Location,
                LastOrderDate = newItemDTO.LastOrderDate,
                ReorderLevel = newItemDTO.ReorderLevel,
                ReorderQuantity = newItemDTO.ReorderQuantity,
                CostPerItem = newItemDTO.CostPerItem,
                Discontinued = newItemDTO.Discontinued,
                Link = newItemDTO.Link,
                Vendor = vendor
            };

            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();

            return Ok("Item created and saved successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

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
            var identifiers = new HashSet<string>();

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
                    continue;

                identifiers.Add(identifier);

                var newItem = new Item
                {
                    Identifier = identifier,
                    Category = values.ElementAtOrDefault(1)?.Trim() ?? "Other",
                    Vendor = await GetOrCreateVendor(values.ElementAtOrDefault(4)?.Trim() ?? "Unknown"),
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
                await _context.BulkInsertAsync(newItems);
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

    [HttpPut("update-quantities")]
    public async Task<IActionResult> UpdateQuantities([FromBody] List<ItemUsageDTO> usages)
    {
        var histories = new List<ItemHistory>();

        foreach (var usage in usages)
        {
            var item = await _context.Items.FindAsync(usage.Id);
            if (item == null)
                return NotFound($"Item with ID {usage.Id} not found.");

            int newQuantity = item.Quantity + usage.QuantityUsed;

            var history = new ItemHistory
            {
                ItemId = item.Id,
                Item = item,
                AmountChanged = usage.QuantityUsed,
                NewQuantity = newQuantity,
                Timestamp = DateTime.UtcNow
            };
            histories.Add(history);

            item.Quantity = newQuantity;
        }

        await _context.ItemHistories.AddRangeAsync(histories);
        await _context.SaveChangesAsync();
        return Ok("Quantities updated successfully.");
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
    private async Task<Vendor> GetOrCreateVendor(string vendorName)
    {
        var vendor = await _context.Vendors
            .FirstOrDefaultAsync(v => v.Name == vendorName);

        if (vendor == null)
        {
            vendor = new Vendor { Name = vendorName };
            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();
        }

        return vendor;
    }

}

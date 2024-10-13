using AutoMapper;
using backend.Models;
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

    [HttpPost("upload")]
    public async Task<IActionResult> UploadItems([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload a valid CSV file.");

        var items = new List<Item>();

        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            string? line;
            bool isHeader = true;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                if (isHeader)
                {
                    isHeader = false;
                    continue;
                }

                var values = line.Split(',');

                try
                {
                    // Find or create Category
                    var categoryName = values.ElementAtOrDefault(1)?.Trim() ?? "Other";
                    var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName)
                                    ?? new Category { Name = categoryName };

                    // Find or create Vendor
                    var vendorName = values.ElementAtOrDefault(4)?.Trim() ?? "Unknown";
                    var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.Name == vendorName)
                                  ?? new Vendor { Name = vendorName };

                    // Create Item from parsed values
                    var item = new Item
                    {
                        Id = int.Parse(values[0]), // ITEM NO
                        Category = category,
                        Vendor = vendor,
                        LastOrderDate = ParseDate(values.ElementAtOrDefault(2)) ?? DateTime.MinValue,
                        Name = values.ElementAtOrDefault(3) ?? "Unnamed Item",
                        Link = string.IsNullOrWhiteSpace(values.ElementAtOrDefault(5)) ? null : values[5],
                        Location = string.IsNullOrWhiteSpace(values.ElementAtOrDefault(6)) ? null : values[6],
                        Description = string.IsNullOrWhiteSpace(values.ElementAtOrDefault(7)) ? null : values[7],
                        CostPerItem = ParseDouble(values.ElementAtOrDefault(8)),
                        Quantity = ParseInt(values.ElementAtOrDefault(9)),
                        TotalValue = ParseDouble(values.ElementAtOrDefault(10)),
                        ReorderLevel = ParseInt(values.ElementAtOrDefault(11)),
                        ReorderQuantity = ParseInt(values.ElementAtOrDefault(13)),
                        Discontinued = ParseBool(values.ElementAtOrDefault(14))
                    };

                    items.Add(item);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Error parsing CSV at line: {line}. Error: {ex.Message}");
                }
            }
        }

        await _context.Items.AddRangeAsync(items);
        await _context.SaveChangesAsync();

        return Ok("Items uploaded and saved successfully.");
    }

    private int ParseInt(string? input)
    {
        return int.TryParse(input, out var result) ? result : 0;
    }

    private double ParseDouble(string? input)
    {
        return double.TryParse(input, out var result) ? result : 0.0;
    }

    private DateTime? ParseDate(string? input)
    {
        return DateTime.TryParse(input, out var result) ? result : (DateTime?)null;
    }

    private bool ParseBool(string? input)
    {
        return input?.Trim().ToLower() == "yes";
    }

    private T? ParseEnum<T>(string? input) where T : struct
    {
        return Enum.TryParse<T>(input, true, out var result) ? result : (T?)null;
    }

}

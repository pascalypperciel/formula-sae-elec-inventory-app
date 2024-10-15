using backend.DTOs;
using backend.Models;

public class ItemDto
{
    public required int Id { get; set; }
    public required string Identifier { get; set; } //Used to be "Item No" in the Excel sheet
    public required string Category { get; set; }
    public DateTime LastOrderDate { get; set; }
    public required string Name { get; set; }
    public string? Link { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public double CostPerItem { get; set; }
    public int Quantity { get; set; }
    public int ReorderLevel { get; set; }
    public int ReorderQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public required VendorDTO Vendor { get; set; }
    public bool Discontinued { get; set; }
}

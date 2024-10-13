using backend.Models;

public class ItemDto
{
    public bool NeedsReorder => Quantity < ReorderLevel;
    public required int Id { get; set; } //Used to be "Item No" in the Excel sheet
    public Category? Category { get; set; }
    public DateTime LastOrderDate { get; set; }
    public required string Name { get; set; }
    public Vendor? Vendor { get; set; }
    public string? Link { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public double CostPerItem { get; set; }
    public int Quantity { get; set; }
    public double TotalValue { get; set; }
    public int ReorderLevel { get; set; }
    public int ReorderQuantity { get; set; }
    public bool Discontinued { get; set; }
}

public class Item
{
    public int Id { get; set; } // Auto-incrementing primary key
    public required string Identifier { get; set; } //Used to be "Item No" in the Excel sheet
    public required string Category { get; set; }
    public DateTime LastOrderDate { get; set; }
    public string? Name { get; set; }
    public required string Vendor { get; set; }
    public string? Link { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public double CostPerItem { get; set; }
    public int Quantity { get; set; }
    public double TotalValue { get; set; }
    public int ReorderLevel { get; set; }
    public int ReorderQuantity { get; set; }
    public bool Discontinued { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

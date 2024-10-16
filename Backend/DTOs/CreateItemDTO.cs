namespace backend.DTOs
{
    public class CreateItemDTO
    {
        public required string Identifier { get; set; }
        public required string Category { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public DateTime? LastOrderDate { get; set; }
        public int ReorderLevel { get; set; }
        public int ReorderQuantity { get; set; }
        public double CostPerItem { get; set; }
        public bool Discontinued { get; set; }
        public string? Link { get; set; }
        public required string VendorName { get; set; }
    }

}

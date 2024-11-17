namespace backend.DTOs
{
    public class ComponentItemDTO
    {
        public int ItemId { get; set; }
        public string Identifier { get; set; } = string.Empty;
        public int AvailableQuantity { get; set; }
        public int QuantityRequired { get; set; }
        public string? ImageUrl { get; set; }
        public int VendorId { get; set; }
    }
}

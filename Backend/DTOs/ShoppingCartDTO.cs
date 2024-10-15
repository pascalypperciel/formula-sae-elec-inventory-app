using backend.Enums;

namespace backend.DTOs
{
    public class ShoppingCartDTO
    {
        public int Id { get; set; }
        public ItemDTO? Item { get; set; }
        public string? VendorName { get; set; }
        public int Quantity { get; set; }
        public ShoppingCartReasons Reason { get; set; }
    }
}

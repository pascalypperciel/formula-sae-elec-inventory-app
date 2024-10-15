using backend.Enums;

namespace backend.Models
{
    public class ShoppingCart
    {
        public int Id { get; set; }  // Auto-incrementing primary key
        public int ItemId { get; set; } // References to the Item
        public int Quantity { get; set; }
        public required Vendor Vendor {  get; set; }
        public ShoppingCartReasons ShoppingCartReasons { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    }
}

using backend.Enums;

namespace backend.Models
{
    public class ShoppingCart
    {
        public int Id { get; set; }  // Auto-incrementing primary key
        public int ItemId { get; set; } // References to the Item
        public Item? Item { get; set; }
        public int Quantity { get; set; }
        public int VendorId { get; set; }
        public Vendor? Vendor {  get; set; }
        public ShoppingCartReasons ShoppingCartReasons { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    }
}

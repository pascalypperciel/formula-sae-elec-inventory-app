using backend.Enums;

namespace backend.DTOs
{
    public class UpdateCartItemDTO
    {
        public int Quantity { get; set; }
        public ShoppingCartReasons Reason { get; set; }
    }
}

namespace backend.DTOs
{
    public class AddToCartDTO
    {
        public int ItemId { get; set; }
        public int VendorId { get; set; }
        public int Quantity { get; set; }
    }
}

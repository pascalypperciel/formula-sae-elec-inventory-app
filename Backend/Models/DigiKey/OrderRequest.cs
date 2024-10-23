namespace backend.Models.DigiKey
{
    public class OrderRequest
    {
        public required string PurchaseOrderNumber { get; set; }
        public required string Currency { get; set; }
        public required Contact BuyerContact { get; set; }
        public required List<LineItem> LineItems { get; set; }
    }
}

namespace backend.Models.DigiKey
{
    public class OrderResponse
    {
        public required string Message { get; set; }
        public int SalesOrderId { get; set; }
        public required string PurchaseOrderNumber { get; set; }
    }
}

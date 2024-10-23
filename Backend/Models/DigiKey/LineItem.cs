namespace backend.Models.DigiKey
{
    public class LineItem
    {
        public required string CustomerLineItemId { get; set; }
        public required string DigiKeyPartNumber { get; set; }
        public required int RequestedQuantity { get; set; }
        public double UnitPrice { get; set; }
    }
}

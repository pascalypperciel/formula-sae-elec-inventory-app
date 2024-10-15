namespace backend.Models
{
    public class ItemHistory
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public required Item Item { get; set; }
        public int AmountChanged { get; set; }
        public int NewQuantity { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

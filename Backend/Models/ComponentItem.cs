namespace backend.Models
{
    public class ComponentItem
    {
        public int Id { get; set; }  // Auto-incrementing primary key
        public int ComponentId { get; set; }
        public required Component Component { get; set; }
        public int ItemId { get; set; }
        public required Item Item { get; set; }
        public int QuantityRequired { get; set; }
    }
}

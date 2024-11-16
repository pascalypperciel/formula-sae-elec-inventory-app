namespace backend.Models
{
    public class Component
    {
        public int Id { get; set; } // Auto-incrementing primary key
        public required string Name { get; set; }
        public List<ComponentItem> ComponentItems { get; set; } = new List<ComponentItem>();
    }
}

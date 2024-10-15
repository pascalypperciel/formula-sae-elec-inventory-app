using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Vendor
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
}

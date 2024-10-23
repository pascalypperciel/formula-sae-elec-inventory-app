namespace backend.Models.DigiKey
{
    public class Contact
    {
        public required string CustomerId { get; set; }
        public required string Name { get; set; }
        public required Address Address { get; set; }
        public required string Telephone { get; set; }
    }
}

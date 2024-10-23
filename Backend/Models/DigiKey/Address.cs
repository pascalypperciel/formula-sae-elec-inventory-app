namespace backend.Models.DigiKey
{
    public class Address
    {
        public required string Company { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string AddressLineOne { get; set; }
        public string? AddressLineTwo { get; set; }
        public required string City { get; set; }
        public required string Province { get; set; }
        public required string PostalCode { get; set; }
        public required string Country { get; set; }
    }
}

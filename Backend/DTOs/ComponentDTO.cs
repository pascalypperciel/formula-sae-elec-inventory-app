namespace backend.DTOs
{
    public class ComponentDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required List<ComponentItemDTO> ComponentItems { get; set; }
    }
}

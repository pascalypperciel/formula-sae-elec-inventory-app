using AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Item, ItemDTO>().ReverseMap();
    }
}

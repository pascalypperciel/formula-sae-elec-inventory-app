using AutoMapper;
using backend.DTOs;
using backend.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Item, ItemDTO>().ReverseMap();
        CreateMap<Component, ComponentDTO>().ReverseMap();
        CreateMap<ComponentItem, ComponentItemDTO>().ReverseMap();
    }
}

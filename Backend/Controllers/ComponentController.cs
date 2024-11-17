using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.DTOs;
using backend.Services;

[ApiController]
[Route("api/components")]
public class ComponentController : ControllerBase
{
    private readonly IComponentService _componentService;

    public ComponentController(IComponentService componentService)
    {
        _componentService = componentService;
    }

    // GET
    [HttpGet]
    public async Task<IActionResult> GetComponents()
    {
        var components = await _componentService.GetComponentsAsync();
        return Ok(components);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetComponentById(int id)
    {
        var component = await _componentService.GetComponentByIdAsync(id);
        if (component == null)
        {
            return NotFound($"Component with ID {id} not found.");
        }
        return Ok(component);
    }

    // POST
    [HttpPost]
    public async Task<IActionResult> CreateComponent([FromBody] ComponentDTO componentDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _componentService.AddComponentAsync(componentDto);
        return CreatedAtAction(nameof(GetComponents), new { id = componentDto.Id }, componentDto);
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> EditComponent(int id, [FromBody] ComponentDTO componentDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _componentService.UpdateComponentAsync(id, componentDto);
        return NoContent();
    }
}

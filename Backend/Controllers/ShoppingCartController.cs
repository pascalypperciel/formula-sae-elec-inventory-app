using backend.DTOs;
using backend.Enums;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoppingCartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShoppingCartController(AppDbContext context)
        {
            _context = context;
        }

        // GET
        [HttpGet]
        public async Task<IActionResult> GetShoppingCartItems()
        {
            var digikeyVendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.Name == "DigiKey");

            if (digikeyVendor == null)
            {
                return NotFound("DigiKey vendor not found.");
            }

            var cartItems = await _context.ShoppingCarts
                .Include(sc => sc.Item)
                .Include(sc => sc.Vendor)
                .Where(sc => sc.Item != null && sc.Vendor != null && sc.Vendor.Id == digikeyVendor.Id)
                .Select(sc => new
                {
                    sc.Id,
                    Item = sc.Item!,
                    Vendor = sc.Vendor!,
                    sc.Quantity,
                    sc.ShoppingCartReasons
                })
                .ToListAsync();

            var result = cartItems.Select(sc => new ShoppingCartDTO
            {
                Id = sc.Id,
                Item = new ItemDTO
                {
                    Id = sc.Item.Id,
                    Identifier = sc.Item.Identifier,
                    Category = sc.Item.Category,
                    Link = sc.Item.Link,
                    Location = sc.Item.Location,
                    Description = sc.Item.Description,
                    CostPerItem = sc.Item.CostPerItem,
                    Name = sc.Item.Name ?? "",
                    Quantity = sc.Item.Quantity,
                    ReorderLevel = sc.Item.ReorderLevel,
                    ReorderQuantity = sc.Item.ReorderQuantity,
                    ImageUrl = sc.Item.ImageUrl,
                    Discontinued = sc.Item.Discontinued,
                    Vendor = new VendorDTO
                    {
                        Id = sc.Vendor.Id,
                        Name = sc.Vendor.Name
                    }
                },
                VendorName = sc.Vendor.Name,
                Quantity = sc.Quantity,
                Reason = sc.ShoppingCartReasons
            }).ToList();

            return Ok(result);
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> AddToCart(ShoppingCart cartItem)
        {
            _context.ShoppingCarts.Add(cartItem);
            await _context.SaveChangesAsync();
            return Ok("Item added to cart.");
        }

        [HttpPost("refresh-reorders")]
        public async Task<IActionResult> RefreshReorders()
        {
            try
            {
                var digikeyVendor = await _context.Vendors
                    .FirstOrDefaultAsync(v => v.Name == "DigiKey");

                if (digikeyVendor == null)
                    return NotFound("DigiKey vendor not found.");

                var itemsToReorder = await _context.Items
                    .Where(item => item.VendorId == digikeyVendor.Id && item.Quantity <= item.ReorderLevel)
                    .ToListAsync();

                foreach (var item in itemsToReorder)
                {
                    var existingCartItem = await _context.ShoppingCarts
                        .FirstOrDefaultAsync(sc => sc.ItemId == item.Id && sc.VendorId == digikeyVendor.Id);

                    if (existingCartItem == null)
                    {
                        if (item.ReorderQuantity > 0)
                        {
                            var newCartItem = new ShoppingCart
                            {
                                ItemId = item.Id,
                                Quantity = item.ReorderQuantity,
                                VendorId = digikeyVendor.Id,
                                ShoppingCartReasons = ShoppingCartReasons.ReorderQuantity,
                                Timestamp = DateTime.UtcNow
                            };
                            _context.ShoppingCarts.Add(newCartItem);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return Ok("Reorders refreshed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] UpdateCartItemDTO updateRequest)
        {
            try
            {
                var cartItem = await _context.ShoppingCarts.FindAsync(id);

                if (cartItem == null)
                {
                    return NotFound("Cart item not found.");
                }

                cartItem.Quantity = updateRequest.Quantity;
                cartItem.ShoppingCartReasons = updateRequest.Reason;

                if (cartItem.Quantity == 0)
                {
                    _context.ShoppingCarts.Remove(cartItem);
                }
                else
                {
                    _context.ShoppingCarts.Update(cartItem);
                }

                await _context.SaveChangesAsync();
                return Ok("Cart item updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var cartItem = await _context.ShoppingCarts.FindAsync(id);
            if (cartItem == null) return NotFound();

            _context.ShoppingCarts.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok("Item removed from cart.");
        }
    }
}

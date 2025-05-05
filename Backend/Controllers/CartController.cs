using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CartController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CartController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Add a book to the cart
    [HttpPost("add")]
    [Authorize(Roles = "Member")] // Only can add to the cart
    public IActionResult AddToCart(Guid bookId, int quantity)
    {
        // Decode MemberId from the JWT token
        var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
        {
            return Unauthorized(new { Message = "Invalid or missing member ID." });
        }
        // Check if the book exists and has enough stock
        var book = _dbContext.Books.FirstOrDefault(b => b.BookId == bookId);
        if (book == null)
        {
            return NotFound(new { Message = "Book not found." });
        }

        if (book.StockQuantity < quantity)
        {
            return BadRequest(new { Message = "Not enough stock available." });
        }

        // Get or create the cart for the member
        var cart = _dbContext.Carts.FirstOrDefault(c => c.MemberId == parsedMemberId);
        if (cart == null)
        {
            cart = new CartModel { MemberId = parsedMemberId };
            _dbContext.Carts.Add(cart);
        }

        // Check if the book is already in the cart
        var cartItem = _dbContext.CartItems.FirstOrDefault(ci => ci.CartId == cart.CartId && ci.BookId == bookId);
        if (cartItem == null)
        {
            // Add a new cart item
            cartItem = new CartItemModel
            {
                CartId = cart.CartId,
                BookId = bookId,
                Quantity = quantity
            };
            _dbContext.CartItems.Add(cartItem);
        }
        else
        {
            // Update the quantity of the existing cart item
            cartItem.Quantity += quantity;

            // Check if the updated quantity exceeds the stock
            if (cartItem.Quantity > book.StockQuantity)
            {
                return BadRequest(new { Message = "Not enough stock available for the updated quantity." });
            }
        }

        _dbContext.SaveChanges();

        return Ok(new { Message = "Book added to cart successfully." });
    }
}

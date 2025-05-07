using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    public class AddToCartRequest
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; }
    }

    // Add a book to the cart
    [HttpPost("add")]
    [Authorize(Roles = "Member")]
    public IActionResult AddToCart([FromBody] AddToCartRequest request)
    {
        Console.WriteLine($"Received BookId: {request.BookId}, Quantity: {request.Quantity}");

        // Decode MemberId from the JWT token
        var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
        {
            return Unauthorized(new { Message = "Invalid or missing member ID." });
        }

        // Check if the book exists and has enough stock
        var book = _dbContext.Books.FirstOrDefault(b => b.BookId == request.BookId);
        if (book == null)
        {
            return NotFound(new { Message = "Book not found." });
        }

        if (book.StockQuantity < request.Quantity)
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
        var cartItem = _dbContext.CartItems.FirstOrDefault(ci => ci.CartId == cart.CartId && ci.BookId == request.BookId);
        if (cartItem == null)
        {
            // Add a new cart item
            cartItem = new CartItemModel
            {
                CartId = cart.CartId,
                BookId = request.BookId,
                Quantity = request.Quantity
            };
            _dbContext.CartItems.Add(cartItem);
        }
        else
        {
            // Update the quantity of the existing cart item
            cartItem.Quantity += request.Quantity;

            // Check if the updated quantity exceeds the stock
            if (cartItem.Quantity > book.StockQuantity)
            {
                return BadRequest(new { Message = "Not enough stock available for the updated quantity." });
            }
        }

        _dbContext.SaveChanges();

        return Ok(new { Message = "Book added to cart successfully." });
    }

    [HttpDelete("remove/{cartItemId}")]
    [Authorize(Roles = "Member")] // Only members can remove items from their cart
    public IActionResult RemoveCartItem(Guid cartItemId)
    {
        try
        {
            // Extract memberId from JWT claims
            var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
            {
                return Unauthorized(new { Message = "Invalid or missing member ID." });
            }

            // Find the cart item
            var cartItem = _dbContext.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefault(ci => ci.CartItemId == cartItemId && ci.Cart != null && ci.Cart.MemberId == parsedMemberId);

            if (cartItem == null)
            {
                return NotFound(new { Message = "Cart item not found." });
            }

            // Remove the cart item
            _dbContext.CartItems.Remove(cartItem);
            _dbContext.SaveChanges();

            return Ok(new { Message = "Cart item removed successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while removing the cart item.", Details = ex.Message });
        }
    }


    [HttpGet("view")]
    [Authorize(Roles = "Member")] // Only members can view their cart
    public IActionResult ViewCart()
    {
        try
        {
            // Extract memberId from JWT claims
            var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
            {
                return Unauthorized(new { Message = "Invalid or missing member ID." });
            }

            // Get the cart for the member
            var cart = _dbContext.Carts
                .Where(c => c.MemberId == parsedMemberId)
                .Select(c => new
                {
                    c.CartId,
                    Items = c.CartItems.Select(ci => new
                    {
                        ci.CartItemId,
                        ci.BookId,
                        BookTitle = ci.Book != null ? ci.Book.Title : "Unknown Title", // Include book title
                        BookImage = ci.Book != null ? ci.Book.CoverImage : null, // Include book cover image
                        ci.Quantity,
                        Price = ci.Book != null ? ci.Book.Price : 0,
                        TotalPrice = ci.Book != null ? ci.Quantity * ci.Book.Price : 0
                    }).ToList()
                })
                .FirstOrDefault();

            if (cart == null || !cart.Items.Any())
            {
                return NotFound(new { Message = "Cart is empty." });
            }

            return Ok(new { Message = "Cart retrieved successfully.", Cart = cart });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while retrieving the cart.", Details = ex.Message });
        }
    }
}
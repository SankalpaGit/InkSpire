using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Backend.Services;
namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public OrderController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // 1. View all orders
    [HttpGet("all")]
    [Authorize(Roles = "Staff")] // Only staff can access this
    public IActionResult GetAllOrders()
    {
        var orders = _dbContext.Orders
            .Select(o => new
            {
                o.OrderId,
                o.MemberId,
                o.TotalPrice,
                o.OrderDate,
                o.OrderStatus,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.BookId,
                    oi.Quantity,
                    oi.Price
                }).ToList()
            })
            .ToList();

        if (!orders.Any())
        {
            return NotFound(new { Message = "No orders found." });
        }

        return Ok(new { Message = "Orders retrieved successfully.", Orders = orders });
    }

    // 3. Mark an order as complete
    [HttpPut("complete-item/{orderItemId}")]
    [Authorize(Roles = "Staff")] // Only staff can mark order items as completed
    public IActionResult MarkOrderItemAsComplete(Guid orderItemId)
    {
        try
        {
            // Find the order item
            var orderItem = _dbContext.OrderItems
                .Include(oi => oi.Order)
                .FirstOrDefault(oi => oi.OrderItemId == orderItemId);

            if (orderItem == null)
            {
                return NotFound(new { Message = "Order item not found." });
            }

            if (orderItem.Order == null || orderItem.Order.OrderStatus == "Complete")
            {
                return BadRequest(new { Message = "The entire order is already marked as complete." });
            }

            // Mark the order item as completed
            orderItem.Order.OrderStatus = "Complete"; // Update the status for the specific item
            _dbContext.SaveChanges();

            return Ok(new { Message = "Order item marked as complete successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while marking the order item as complete.", Details = ex.Message });
        }
    }

    // 4. Search order by ID
    [HttpGet("{orderId}")]
    [Authorize(Roles = "Staff")] // Both members and staff can view orders
    public IActionResult GetOrderById(Guid orderId)
    {
        var order = _dbContext.Orders
            .Where(o => o.OrderId == orderId)
            .Select(o => new
            {
                o.OrderId,
                o.MemberId,
                o.TotalPrice,
                o.OrderDate,
                o.OrderStatus,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.OrderItemId,
                    oi.BookId,
                    oi.Quantity,
                    oi.Price,
                    OrderStatus = oi.Order != null ? oi.Order.OrderStatus : "Unknown", // Include the status of the order item
                    BookTitle = oi.Book != null ? oi.Book.Title : "Unknown"
                }).ToList()
            })
            .FirstOrDefault();

        if (order == null)
        {
            return NotFound(new { Message = "Order not found." });
        }

        return Ok(new { Message = "Order retrieved successfully.", Order = order });
    }

    [HttpPost("checkout")]
    [Authorize(Roles = "Member")] // Only members can checkout
    public IActionResult Checkout()
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
                        ci.BookId,
                        ci.Quantity,
                        StockQuantity = ci.Book != null ? ci.Book.StockQuantity : 0,
                        Price = ci.Book != null ? ci.Book.Price : 0,
                        Title = ci.Book != null ? ci.Book.Title : "Unknown"
                    }).ToList()
                })
                .FirstOrDefault();

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest(new { Message = "Cart is empty." });
            }

            // Validate stock availability
            foreach (var item in cart.Items)
            {
                if (item.Quantity > item.StockQuantity)
                {
                    return BadRequest(new { Message = $"Not enough stock for book with ID {item.BookId}." });
                }
            }

            // Calculate total price and apply discounts
            var totalQuantity = cart.Items.Sum(item => item.Quantity);
            var totalPrice = cart.Items.Sum(item => item.Price * item.Quantity);

            if (totalQuantity >= 10)
            {
                totalPrice *= 0.90m; // 10% discount
            }
            else if (totalQuantity >= 5)
            {
                totalPrice *= 0.95m; // 5% discount
            }

            // Create the order
            var order = new OrderModel
            {
                MemberId = parsedMemberId,
                TotalPrice = totalPrice,
                OrderDate = DateTime.UtcNow,
                OrderStatus = "Pending", // Default status is "Pending"
                OrderItems = cart.Items.Select(item => new OrderItemModel
                {
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    Price = item.Price
                }).ToList()
            };

            _dbContext.Orders.Add(order);

            // Deduct stock and clear the cart
            foreach (var item in cart.Items)
            {
                var book = _dbContext.Books.FirstOrDefault(b => b.BookId == item.BookId);
                if (book != null)
                {
                    book.StockQuantity -= item.Quantity;
                }

                var cartItem = _dbContext.CartItems.FirstOrDefault(ci => ci.BookId == item.BookId && ci.CartId == cart.CartId);
                if (cartItem != null)
                {
                    _dbContext.CartItems.Remove(cartItem);
                }
            }

            _dbContext.SaveChanges();

            // Send confirmation email
            var member = _dbContext.Members.FirstOrDefault(m => m.Id == parsedMemberId);
            if (member != null)
            {
                var emailService = new EmailService();
                var subject = "Order Confirmation";
                var body = GenerateInvoice(order, cart.Items.Cast<dynamic>().ToList());
                emailService.SendEmail(member.Email, subject, body);
            }

            return Ok(new { Message = "Checkout completed successfully.", OrderId = order.OrderId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred during checkout.", Details = ex.Message });
        }
    }

    [HttpDelete("cancel-item/{orderItemId}")]
    [Authorize(Roles = "Member")] // Only members can cancel their order items
    public IActionResult CancelOrderItem(Guid orderItemId)
    {
        try
        {
            // Extract memberId from JWT claims
            var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
            {
                return Unauthorized(new { Message = "Invalid or missing member ID." });
            }

            // Find the order item
            var orderItem = _dbContext.OrderItems
                .Include(oi => oi.Order)
                .FirstOrDefault(oi => oi.OrderItemId == orderItemId && oi.Order != null && oi.Order.MemberId == parsedMemberId);

            if (orderItem == null)
            {
                return NotFound(new { Message = "Order item not found." });
            }

            if (orderItem.Order == null || orderItem.Order.OrderStatus != "Pending")
            {
                return BadRequest(new { Message = "Only items from pending orders can be canceled." });
            }

            // Restore stock for the canceled item
            var book = _dbContext.Books.FirstOrDefault(b => b.BookId == orderItem.BookId);
            if (book != null)
            {
                book.StockQuantity += orderItem.Quantity;
            }

            // Remove the order item
            _dbContext.OrderItems.Remove(orderItem);

            // If the order has no remaining items, delete the order
            if (!_dbContext.OrderItems.Any(oi => oi.OrderId == orderItem.OrderId))
            {
                _dbContext.Orders.Remove(orderItem.Order);
            }

            _dbContext.SaveChanges();

            return Ok(new { Message = "Order item canceled successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while canceling the order item.", Details = ex.Message });
        }
    }
    // 5. Generate invoice HTML
    private string GenerateInvoice(OrderModel order, List<dynamic> items)
    {
        var invoice = $@"
        <div style='font-family: Arial, sans-serif; color: #333; background-color: #f4f4f9; padding: 20px; border-radius: 10px;'>
            <h1 style='color: indigo; text-align: center;'>Thank You for Your Order!</h1>
            <p style='text-align: center; font-size: 18px;'>Your claim code is: <strong style='color: darkgrey;'>{order.OrderId}</strong></p>
            <h2 style='color: indigo; border-bottom: 2px solid darkgrey; padding-bottom: 5px;'>Order Details</h2>
            <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
                <thead>
                    <tr style='background-color: indigo; color: white;'>
                        <th style='padding: 10px; text-align: left; border: 1px solid darkgrey;'>Book Title</th>
                        <th style='padding: 10px; text-align: left; border: 1px solid darkgrey;'>Quantity</th>
                        <th style='padding: 10px; text-align: left; border: 1px solid darkgrey;'>Price</th>
                        <th style='padding: 10px; text-align: left; border: 1px solid darkgrey;'>Total</th>
                    </tr>
                </thead>
                <tbody>";

        foreach (var item in items)
        {
            invoice += $@"
                    <tr style='background-color: #fff; color: #333;'>
                        <td style='padding: 10px; border: 1px solid darkgrey;'>{item.Title}</td>
                        <td style='padding: 10px; border: 1px solid darkgrey;'>{item.Quantity}</td>
                        <td style='padding: 10px; border: 1px solid darkgrey;'>{item.Price:C}</td>
                        <td style='padding: 10px; border: 1px solid darkgrey;'>{item.Quantity * item.Price:C}</td>
                    </tr>";
        }

        invoice += $@"
                </tbody>
            </table>
            <h3 style='color: indigo; text-align: right; margin-top: 20px;'>Total Amount: {order.TotalPrice:C}</h3>
            <p style='text-align: center; margin-top: 30px; font-size: 16px; color: darkgrey;'>Thank you for trusting us!</p>
        </div>";

        return invoice;
    }

}
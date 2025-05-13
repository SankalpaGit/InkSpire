using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SaleController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public SaleController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Add a sale
    [HttpPost("add")]
    [Authorize(Roles = "Admin")] // Only admins can add sales
    public IActionResult AddSale([FromBody] SaleModel model)
    {
        if (model.StartDate > model.EndDate)
        {
            return BadRequest(new { Message = "Start date cannot be after the end date." });
        }

        model.SaleId = Guid.NewGuid();

        // Enforce UTC before saving
        model.StartDate = DateTime.SpecifyKind(model.StartDate, DateTimeKind.Utc);
        model.EndDate = DateTime.SpecifyKind(model.EndDate, DateTimeKind.Utc);

        _dbContext.Sales.Add(model);
        _dbContext.SaveChanges();

        // Apply the discount to the book's price
        if (model.BookId.HasValue)
        {
            // If the sale applies to a specific book
            var book = _dbContext.Books.FirstOrDefault(b => b.BookId == model.BookId.Value);
            if (book != null)
            {
                book.Price -= book.Price * (decimal)(model.DiscountPercentage / 100);
            }
        }
        else
        {
            // If the sale applies to all books
            var books = _dbContext.Books.ToList();
            foreach (var book in books)
            {
                book.Price -= book.Price * (decimal)(model.DiscountPercentage / 100);
            }
        }

        _dbContext.SaveChanges();

        return Ok(new { Message = "Sale added successfully and discounts applied.", SaleId = model.SaleId });
    }
    // Edit a sale
    [HttpPut("edit/{saleId}")]
    [Authorize] // Only admins can edit sales
    public IActionResult EditSale(Guid saleId, [FromBody] SaleModel updatedModel)
    {
        var sale = _dbContext.Sales.FirstOrDefault(s => s.SaleId == saleId);
        if (sale == null)
        {
            return NotFound(new { Message = "Sale not found." });
        }

        // Update the sale details
        sale.DiscountPercentage = updatedModel.DiscountPercentage;
        sale.StartDate = updatedModel.StartDate;
        sale.EndDate = updatedModel.EndDate;

        _dbContext.SaveChanges();

        return Ok(new { Message = "Sale updated successfully." });
    }

    // Get active sales
    [HttpGet("active")]
    public IActionResult GetActiveSales()
    {
        var currentDate = DateTime.UtcNow;

        // Retrieve active sales
        var activeSales = _dbContext.Sales
            .Where(s => s.StartDate <= currentDate && s.EndDate >= currentDate)
            .ToList();

        return Ok(activeSales);
    }

    // Remove expired sales
    [HttpDelete("remove-expired")]
    [Authorize(Roles = "Admin")] // Only admins can remove expired sales
    public IActionResult RemoveExpiredSales()
    {
        var currentDate = DateTime.UtcNow;

        // Find expired sales
        var expiredSales = _dbContext.Sales
            .Where(s => s.EndDate < currentDate)
            .ToList();

        if (!expiredSales.Any())
        {
            return Ok(new { Message = "No expired sales to remove." });
        }

        // Remove expired sales
        _dbContext.Sales.RemoveRange(expiredSales);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Expired sales removed successfully." });
    }

}
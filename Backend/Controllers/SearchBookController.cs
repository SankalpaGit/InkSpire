using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SearchBookController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public SearchBookController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchBooks([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest(new { Message = "Search query cannot be empty." });
        }

        // Perform a case-insensitive search in Title, ISBN, and Description
        var books = await _dbContext.Books
            .Where(b => EF.Functions.Like(b.Title, $"%{query}%") ||
                        EF.Functions.Like(b.ISBN, $"%{query}%") ||
                        EF.Functions.Like(b.Description, $"%{query}%"))
            .ToListAsync();

        if (books.Count == 0)
        {
            return NotFound(new { Message = "No books found matching the search query." });
        }

        return Ok(books);
    }
}
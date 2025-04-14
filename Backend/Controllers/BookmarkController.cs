using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookmarkController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public BookmarkController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Add a bookmark
    [HttpPost("add")]
    [Authorize] // Only authenticated members can add bookmarks
    public IActionResult AddBookmark([FromBody] BookmarkModel model)
    {
        // Check if the bookmark already exists
        var existingBookmark = _dbContext.Bookmarks
            .FirstOrDefault(b => b.MemberId == model.MemberId && b.BookId == model.BookId);

        if (existingBookmark != null)
        {
            return BadRequest(new { Message = "This book is already bookmarked by the member." });
        }

        // Add the bookmark
        model.BookmarkId = Guid.NewGuid();
        model.CreatedAt = DateTime.UtcNow;
        _dbContext.Bookmarks.Add(model);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Book bookmarked successfully." });
    }

    // Remove a bookmark
    [HttpDelete("remove")]
    [Authorize] // Only authenticated members can remove bookmarks
    public IActionResult RemoveBookmark([FromQuery] Guid memberId, [FromQuery] Guid bookId)
    {
        // Find the bookmark
        var bookmark = _dbContext.Bookmarks
            .FirstOrDefault(b => b.MemberId == memberId && b.BookId == bookId);

        if (bookmark == null)
        {
            return NotFound(new { Message = "Bookmark not found." });
        }

        // Remove the bookmark
        _dbContext.Bookmarks.Remove(bookmark);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Bookmark removed successfully." });
    }
}
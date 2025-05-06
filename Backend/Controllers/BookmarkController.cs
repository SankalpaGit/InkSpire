using Backend.Models;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

    [HttpPost("add")]
    [Authorize(Roles = "Member")] // Only authenticated members can add bookmarks
    public IActionResult AddBookmark([FromBody] BookmarkRequestDTO request)
    {
        // Decode MemberId from the JWT token
        var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
        {
            return Unauthorized(new { Message = "Invalid or missing member ID." });
        }

        // Validate BookId
        if (request.BookId == Guid.Empty)
        {
            return BadRequest(new { Message = "BookId cannot be empty." });
        }

        // Check if the bookmark already exists
        var existingBookmark = _dbContext.Bookmarks
            .FirstOrDefault(b => b.MemberId == parsedMemberId && b.BookId == request.BookId);

        if (existingBookmark != null)
        {
            return BadRequest(new { Message = "This book is already bookmarked by the member." });
        }

        // Create a new bookmark
        var bookmark = new BookmarkModel
        {
            BookmarkId = Guid.NewGuid(),
            MemberId = parsedMemberId,
            BookId = request.BookId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Bookmarks.Add(bookmark);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Book bookmarked successfully." });
    }

    [HttpDelete("remove")]
    [Authorize(Roles = "Member")] // Only authenticated members can remove bookmarks
    public IActionResult RemoveBookmark([FromQuery] Guid bookId)
    {
        // Decode MemberId from the JWT token
        var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
        {
            return Unauthorized(new { Message = "Invalid or missing member ID." });
        }

        // Validate BookId
        if (bookId == Guid.Empty)
        {
            return BadRequest(new { Message = "BookId cannot be empty." });
        }

        // Find the bookmark
        var bookmark = _dbContext.Bookmarks
            .FirstOrDefault(b => b.MemberId == parsedMemberId && b.BookId == bookId);

        if (bookmark == null)
        {
            return NotFound(new { Message = "Bookmark not found." });
        }

        // Remove the bookmark
        _dbContext.Bookmarks.Remove(bookmark);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Bookmark removed successfully." });
    }


    [HttpGet("view")]
    [Authorize(Roles = "Member")] // Only authenticated members can view bookmarks
    public IActionResult ViewBookmarks()
    {
        try
        {
            // Decode MemberId from the JWT token
            var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
            {
                return Unauthorized(new { Message = "Invalid or missing member ID." });
            }

            // Get all bookmarks for the member
            var bookmarks = _dbContext.Bookmarks
                .Where(b => b.MemberId == parsedMemberId)
                .Select(b => new
                {
                    b.BookmarkId,
                    b.BookId,
                    BookTitle = b.Book != null ? b.Book.Title : "Unknown Title", // Include book title
                    BookImage = b.Book != null ? b.Book.CoverImage : null, // Include book cover image
                    BookAuthor = b.Book != null ? b.Book.Author : "Unknown Author", // Include book author
                    b.CreatedAt
                })
                .ToList();

            if (!bookmarks.Any())
            {
                return NotFound(new { Message = "No bookmarks found." });
            }

            return Ok(new { Message = "Bookmarks retrieved successfully.", Bookmarks = bookmarks });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while retrieving bookmarks.", Details = ex.Message });
        }
    }

}
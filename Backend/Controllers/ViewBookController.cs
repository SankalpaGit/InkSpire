using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;

namespace Backend.Controllers;

    [Route("api/[controller]")]
    [ApiController]
    public class ViewBookController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ViewBookController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Get all books with pagination
        [HttpGet("all")]
        public IActionResult GetAllBooks([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 1)
        {
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { Message = "Page number and page size must be greater than zero." });
            }

            var books = _dbContext.Books
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalBooks = _dbContext.Books.Count();

            return Ok(new
            {
                TotalBooks = totalBooks,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Books = books
            });
        }

    // Get a book by ID
    [HttpGet("{id}")]
    public IActionResult GetBookById(Guid id)
    {
        var book = _dbContext.Books.FirstOrDefault(b => b.BookId == id);

        if (book == null)
        {
            return NotFound(new { Message = "Book not found." });
        }

        return Ok(book);
    }
}

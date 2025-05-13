using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookCategories : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public BookCategories(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // 1. API to display 6 random books
        [HttpGet("random-books")]
        public IActionResult GetRandomBooks()
        {
            try
            {
                var randomBooks = _dbContext.Books
                    .OrderBy(b => Guid.NewGuid()) // Randomize the order
                    .Take(6) // Take 6 books
                    .Select(b => new
                    {
                        b.BookId,
                        b.CoverImage,
                        b.Title,
                        b.Author,
                        b.Price
                    })
                    .ToList();

                return Ok(new { Message = "Random books retrieved successfully.", Books = randomBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving random books.", Details = ex.Message });
            }
        }


        [HttpGet("best-sellers")]
        public IActionResult GetBestSellers()
        {
            try
            {
                // Group by BookId and calculate the total quantity sold for each book
                var bestSellers = _dbContext.OrderItems
                    .Include(oi => oi.Book) // Include the Book entity for access to book details
                    .Where(oi => oi.Order != null && oi.Order.OrderStatus == "Complete") // Only consider completed orders
                    .GroupBy(oi => new { oi.BookId, oi.Book.CoverImage ,oi.Book.Title, oi.Book.Author, oi.Book.Price }) // Group by book details
                    .Select(g => new
                    {
                        BookId = g.Key.BookId,
                        Title = g.Key.Title,
                        Author = g.Key.Author,
                        Price = g.Key.Price,
                        TotalSold = g.Sum(oi => oi.Quantity) // Sum the quantities sold
                    })
                    .OrderByDescending(g => g.TotalSold) // Order by most sold
                    .Take(10) // Limit to top 10 best sellers
                    .ToList();

                return Ok(new { Message = "Best sellers retrieved successfully.", Books = bestSellers });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving best sellers.", Details = ex.Message });
            }
        }
        // 3. API to display recently published books
        [HttpGet("recently-published")]
        public IActionResult GetRecentlyPublishedBooks()
        {
            try
            {
                var recentlyPublishedBooks = _dbContext.Books
                    .Where(b => b.PublicationDate != null)
                    .OrderByDescending(b => b.PublicationDate) // Order by most recent publication date
                    .Take(10) // Limit to top 10
                    .Select(b => new
                    {
                        b.BookId,
                        b.CoverImage,
                        b.Title,
                        b.Author,
                        b.Price
                    })
                    .ToList();

                return Ok(new { Message = "Recently published books retrieved successfully.", Books = recentlyPublishedBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving recently published books.", Details = ex.Message });
            }
        }

        // 4. API to display recently created books
        [HttpGet("recently-created")]
        public IActionResult GetRecentlyCreatedBooks()
        {
            try
            {
                var recentlyCreatedBooks = _dbContext.Books
                    .OrderByDescending(b => b.CreatedAt) // Order by most recent creation date
                    .Take(10) // Limit to top 10
                    .Select(b => new
                    {
                        b.BookId,
                        b.CoverImage,
                        b.Title,
                        b.Author,
                        b.Price
                    })
                    .ToList();

                return Ok(new { Message = "Recently created books retrieved successfully.", Books = recentlyCreatedBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving recently created books.", Details = ex.Message });
            }
        }

        // 5. API to display award-winning books
        [HttpGet("award-winning")]
        public IActionResult GetAwardWinningBooks()
        {
            try
            {
                var awardWinningBooks = _dbContext.Books
                    .Where(b => b.IsExclusiveEdition) // Filter by exclusive edition
                    .Select(b => new
                    {
                        b.BookId,
                        b.CoverImage,
                        b.Title,
                        b.Author,
                        b.Price
                    })
                    .ToList();

                return Ok(new { Message = "Award-winning books retrieved successfully.", Books = awardWinningBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving award-winning books.", Details = ex.Message });
            }
        }
    }
}

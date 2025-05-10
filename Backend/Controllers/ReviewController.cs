using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Backend.Models;
using Backend.Dtos;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public ReviewController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("review")]
        [Authorize(Roles = "Member")] // Only members can submit reviews
        public IActionResult SubmitReview([FromBody] ReviewRequestDto reviewDto)
        {
            try
            {
                // Extract memberId from JWT claims
                var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
                {
                    return Unauthorized(new { Message = "Invalid or missing member ID." });
                }

                // Check if the member has completed an order for the book
                var hasCompletedOrder = _dbContext.OrderItems
                    .Include(oi => oi.Order)
                    .Any(oi => oi.BookId == reviewDto.BookId &&
                               oi.Order != null &&
                               oi.Order.MemberId == parsedMemberId &&
                               oi.Order.OrderStatus == "Complete");

                if (!hasCompletedOrder)
                {
                    return BadRequest(new { Message = "You can only review books you have successfully ordered and completed." });
                }

                // Save the review
                var review = new ReviewModel
                {
                    ReviewId = Guid.NewGuid(),
                    MemberId = parsedMemberId,
                    BookId = reviewDto.BookId,
                    Rating = reviewDto.Rating,
                    Comments = reviewDto.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Reviews.Add(review);
                _dbContext.SaveChanges();

                return Ok(new { Message = "Review submitted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while submitting the review.", Details = ex.Message });
            }
        }

        [HttpGet("my-reviews")]
        [Authorize(Roles = "Member")] // Only members can view their reviews
        public IActionResult GetMyReviews()
        {
            try
            {
                // Extract memberId from JWT claims
                var memberId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(memberId) || !Guid.TryParse(memberId, out var parsedMemberId))
                {
                    return Unauthorized(new { Message = "Invalid or missing member ID." });
                }

                // Fetch all reviews made by the logged-in member
                var reviews = _dbContext.Reviews
                    .Where(r => r.MemberId == parsedMemberId)
                    .Select(r => new
                    {
                        r.ReviewId,
                        r.BookId,
                        r.Rating,
                        r.Comments,
                        r.CreatedAt
                    })
                    .ToList();

                if (!reviews.Any())
                {
                    return NotFound(new { Message = "No reviews found for the logged-in member." });
                }

                return Ok(new
                {
                    Message = "Reviews retrieved successfully.",
                    Reviews = reviews
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving reviews.", Details = ex.Message });
            }
        }

        [HttpGet("reviews/{bookId}")]
        [AllowAnonymous] // Anyone can view reviews for a book
        public IActionResult GetAllReviewsForBook(Guid bookId)
        {
            try
            {
                // Fetch all reviews for the specified book
                var reviews = _dbContext.Reviews
                    .Where(r => r.BookId == bookId)
                    .Select(r => new
                    {
                        r.ReviewId,
                        r.BookId,
                        r.MemberId,
                        r.Rating,
                        r.Comments,
                        r.CreatedAt
                    })
                    .ToList();

                if (!reviews.Any())
                {
                    return NotFound(new { Message = "No reviews found for this book." });
                }

                return Ok(new
                {
                    Message = "Reviews retrieved successfully.",
                    Reviews = reviews
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving reviews.", Details = ex.Message });
            }
        }
    }
}

using Backend.Models;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IWebHostEnvironment _environment;

    public BookController(AppDbContext dbContext, IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _environment = environment;
    }

    [HttpPost("add")]
    [Authorize(Roles = "Admin")] // Only admins can access this endpoint
    public async Task<IActionResult> AddBook([FromForm] BookCreateRequestModel model)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.Title) || string.IsNullOrWhiteSpace(model.Author) ||
            string.IsNullOrWhiteSpace(model.Genre) || model.Price <= 0 || model.StockQuantity < 0)
        {
            return BadRequest(new { Message = "Invalid book details. Please check the input fields." });
        }

        string? imagePath = null;

        // Handle image upload
        if (model.CoverImage != null && model.CoverImage.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{model.CoverImage.FileName}";
            imagePath = Path.Combine("Uploads", uniqueFileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await model.CoverImage.CopyToAsync(fileStream);
            }
        }
        else
        {
            return BadRequest(new { Message = "Cover image is required and must not be empty." });
        }

        // Map the request to the BookModel
        var book = new BookModel
        {
            BookId = Guid.NewGuid(),
            Title = model.Title,
            Author = model.Author,
            Description = model.Description,
            Genre = model.Genre,
            Price = model.Price,
            StockQuantity = model.StockQuantity,
            Language = model.Language,
            Format = model.Format,
            Publisher = model.Publisher,
            ISBN = model.ISBN,
            CoverImage = imagePath, // Save the relative path to the database
            PublicationDate = model.PublicationDate,
            IsAvailableInStore = model.IsAvailableInStore,
            IsExclusiveEdition = model.IsExclusiveEdition,
            CreatedAt = DateTime.UtcNow
        };

        // Save the book to the database
        _dbContext.Books.Add(book);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Book added successfully.", BookId = book.BookId });
    }


    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")] // Only admins can update books
    public async Task<IActionResult> UpdateBook(Guid id, [FromForm] BookUpdateRequestModel model)
    {
        var book = _dbContext.Books.FirstOrDefault(b => b.BookId == id);

        if (book == null)
        {
            return NotFound(new { Message = "Book not found." });
        }

        // Update only the fields that are provided
        if (!string.IsNullOrWhiteSpace(model.Title))
        {
            book.Title = model.Title;
        }

        if (!string.IsNullOrWhiteSpace(model.Author))
        {
            book.Author = model.Author;
        }

        if (!string.IsNullOrWhiteSpace(model.Description))
        {
            book.Description = model.Description;
        }

        if (!string.IsNullOrWhiteSpace(model.Genre))
        {
            book.Genre = model.Genre;
        }

        if (model.Price.HasValue && model.Price > 0)
        {
            book.Price = model.Price.Value;
        }

        if (model.StockQuantity.HasValue && model.StockQuantity >= 0)
        {
            book.StockQuantity = model.StockQuantity.Value;
        }

        if (!string.IsNullOrWhiteSpace(model.Language))
        {
            book.Language = model.Language;
        }

        if (!string.IsNullOrWhiteSpace(model.Format))
        {
            book.Format = model.Format;
        }

        if (!string.IsNullOrWhiteSpace(model.Publisher))
        {
            book.Publisher = model.Publisher;
        }

        if (!string.IsNullOrWhiteSpace(model.ISBN))
        {
            book.ISBN = model.ISBN;
        }

        if (model.PublicationDate.HasValue)
        {
            book.PublicationDate = model.PublicationDate.Value;
        }

        if (model.IsAvailableInStore.HasValue)
        {
            book.IsAvailableInStore = model.IsAvailableInStore.Value;
        }

        if (model.IsExclusiveEdition.HasValue)
        {
            book.IsExclusiveEdition = model.IsExclusiveEdition.Value;
        }

        // Handle image upload if a new image is provided
        if (model.CoverImage != null && model.CoverImage.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{model.CoverImage.FileName}";
            var imagePath = Path.Combine("Uploads", uniqueFileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await model.CoverImage.CopyToAsync(fileStream);
            }

            book.CoverImage = imagePath; // Update the cover image path
        }

        _dbContext.SaveChanges();

        return Ok(new { Message = "Book updated successfully." });
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Admin")] // Only admins can delete books
    public IActionResult DeleteBook(Guid id)
    {
        var book = _dbContext.Books.FirstOrDefault(b => b.BookId == id);

        if (book == null)
        {
            return NotFound(new { Message = "Book not found." });
        }

        // Delete the book
        _dbContext.Books.Remove(book);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Book deleted successfully." });
    }

}
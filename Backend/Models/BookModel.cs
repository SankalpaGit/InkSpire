using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class BookModel
{
    [Key]
    public Guid BookId { get; set; } // Primary Key

    [Required]
    [StringLength(200)]
    public required string  Title { get; set; } // Book title

    [Required]
    [StringLength(100)]
    public required string Author { get; set; } // Author name

    [StringLength(1000)]
    public required string Description { get; set; } // Book description

    [Required]
    [StringLength(50)]
    public required string Genre { get; set; } // Genre of the book

    [Required]
    [Range(0, double.MaxValue)]
    public required decimal Price { get; set; } // Price of the book

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; } // Quantity in stock

    [Required]
    [StringLength(50)]
    public required string Language { get; set; } // Language of the book

    [Required]
    [StringLength(50)]
    public required string Format { get; set; } // Format (e.g., Hardcover, Paperback, eBook)

    [StringLength(100)]
    public required string Publisher { get; set; } // Publisher name

    [StringLength(13)]
    public required string ISBN { get; set; } // ISBN number

    [StringLength(500)]
    public required string CoverImage { get; set; } // URL or path to the cover image

    public DateTime? PublicationDate { get; set; } // Publication date of the book

    public bool IsAvailableInStore { get; set; } // Whether the book is available in the store

    public bool IsExclusiveEdition { get; set; } // Whether the book is an exclusive edition

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp when the book was added
}
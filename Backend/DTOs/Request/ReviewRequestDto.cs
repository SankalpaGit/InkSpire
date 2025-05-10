using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos;

public class ReviewRequestDto
{
    [Required]
    public Guid BookId { get; set; } // The ID of the book being reviewed

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; } // Rating (1 to 5)

    [StringLength(1000)]
    public string? Comment { get; set; } // Optional comment
}
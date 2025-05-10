using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class ReviewModel
{
    [Key]
    public Guid ReviewId { get; set; } // Primary Key

    [Required]
    [ForeignKey("Book")]
    public Guid BookId { get; set; } // Foreign Key to BookModel

    [Required]
    [ForeignKey("Member")]
    public Guid MemberId { get; set; } // Foreign Key to MemberModel

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; } // Rating given by the member (1-5)

    public string? Comments { get; set; } // Review comment

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp when the review was created
}

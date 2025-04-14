using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class BookmarkModel
{
    [Key]
    public Guid BookmarkId { get; set; } // Primary key for the bookmark

    [Required]
    [ForeignKey("Member")]
    public Guid MemberId { get; set; } // Foreign key to the MemberModel

    [Required]
    [ForeignKey("Book")]
    public Guid BookId { get; set; } // Foreign key to the BookModel

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp when the bookmark was created
}
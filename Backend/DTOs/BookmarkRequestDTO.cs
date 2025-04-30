using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class BookmarkRequestDTO
{    // ID of the member who created the bookmark
    [Required]
    public Guid BookId { get; set; } // ID of the book being bookmarked
}

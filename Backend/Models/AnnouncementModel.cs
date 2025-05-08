using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class AnnouncementModel
{
    [Key]
    public Guid AnnouncementId { get; set; } = Guid.NewGuid();

    [Required]
    public required string Message { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public DateTime ExpiresAt { get; set; } // Expiration time for the announcement
}

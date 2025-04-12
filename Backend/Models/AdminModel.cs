using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class AdminModel
{
    [Key]
    public Guid Id { get; set; } // Unique identifier for the admin

    [Required]
    [EmailAddress]
    public required string Email { get; set; } // Admin's email for login

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public required string Password { get; set; } // Admin's hashed password
}
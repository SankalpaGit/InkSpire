using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class StaffModel
{
    [Key]
    public Guid Id { get; set; } // Unique identifier for the staff

    [Required]
    [StringLength(25)]
    public required string FirstName { get; set; } // Staff's first name

    [Required]
    [StringLength(25)]
    public required string LastName { get; set; } // Staff's last name

    [Required]
    [EmailAddress]
    public required string Email { get; set; } // Staff's email for login

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public required string Password { get; set; } // Staff's hashed password
}
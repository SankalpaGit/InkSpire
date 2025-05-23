using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class MemberModel
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [StringLength(25)]
    public required string FirstName { get; set; }

    [Required]
    [StringLength(25)]
    public required string LastName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public required string Password { get; set; }
}
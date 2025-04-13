using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Backend.DTOs;

public class BookCreateRequestModel
{
    [Required]
    [StringLength(200)]
    public required string Title { get; set; }

    [Required]
    [StringLength(100)]
    public required string Author { get; set; }

    [StringLength(1000)]
    public required string Description { get; set; }

    [Required]
    [StringLength(50)]
    public required string Genre { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [Required]
    [StringLength(50)]
    public required string Language { get; set; }

    [Required]
    [StringLength(50)]
    public required string Format { get; set; }

    [StringLength(100)]
    public required string Publisher { get; set; }

    [StringLength(13)]
    public required string ISBN { get; set; }

    public required IFormFile CoverImage { get; set; } // Image file

    public DateTime? PublicationDate { get; set; }

    public bool IsAvailableInStore { get; set; }

    public bool IsExclusiveEdition { get; set; }
}
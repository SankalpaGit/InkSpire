using System;
using Microsoft.AspNetCore.Http;

namespace Backend.DTOs;

public class BookUpdateRequestModel
{
    public string? Title { get; set; }
    public string? Author { get; set; }
    public string? Description { get; set; }
    public string? Genre { get; set; }
    public decimal? Price { get; set; }
    public int? StockQuantity { get; set; }
    public string? Language { get; set; }
    public string? Format { get; set; }
    public string? Publisher { get; set; }
    public string? ISBN { get; set; }
    public DateTime? PublicationDate { get; set; }
    public bool? IsAvailableInStore { get; set; }
    public bool? IsExclusiveEdition { get; set; }
    public IFormFile? CoverImage { get; set; }
}

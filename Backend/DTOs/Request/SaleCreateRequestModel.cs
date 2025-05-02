using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;


public class SaleCreateRequestModel
{
    [Required]
    [Range(0, 100)]
    public double DiscountPercentage { get; set; } // Discount percentage (0-100)

    public Guid? BookId { get; set; } // Nullable: If null, the sale applies to all books

    [Required]
    public DateTime StartDate { get; set; } // Start date of the sale

    [Required]
    public DateTime EndDate { get; set; } // End date of the sale
}
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class SaleModel
{
    [Key]
    public Guid SaleId { get; set; } // Unique identifier for the sale

    [Required]
    [Range(0, 100)]
    public double DiscountPercentage { get; set; } // Discount percentage (0-100)

    [ForeignKey("Book")]
    public Guid? BookId { get; set; } // Nullable: If null, the sale applies to all books

    public DateTime StartDate { get; set; } // Start date of the sale

    public DateTime EndDate { get; set; } // End date of the sale

    // Navigation property for the related book
    public virtual BookModel? Book { get; set; }
}
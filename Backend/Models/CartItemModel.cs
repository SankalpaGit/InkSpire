using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Backend.Models;

public class CartItemModel
{
    [Key]
    public Guid CartItemId { get; set; } = Guid.NewGuid(); // Unique identifier for the cart item

    [Required]
    [ForeignKey("Cart")]
    public Guid CartId { get; set; } // Link to the cart

    [Required]
    [ForeignKey("Book")]
    public Guid BookId { get; set; } // Link to the book

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; } // Quantity of the book in the cart

    public virtual BookModel? Book { get; set; } // Navigation property for the book
}
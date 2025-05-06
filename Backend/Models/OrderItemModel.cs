using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class OrderItemModel
{
    [Key]
    public Guid OrderItemId { get; set; } = Guid.NewGuid(); // Unique identifier for the order item

    [Required]
    [ForeignKey("Order")]
    public Guid OrderId { get; set; } // Link to the order

    [Required]
    [ForeignKey("Book")]
    public Guid BookId { get; set; } // Link to the book

    [Required]
    public int Quantity { get; set; } // Quantity of the book in the order

    [Required]
    public decimal Price { get; set; } // Price of the book at the time of the order

    public virtual OrderModel ? Order { get; set; } // Navigation property for the order
    public virtual BookModel ? Book { get; set; } // Navigation property for the book
}

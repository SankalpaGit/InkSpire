using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class OrderModel
{
    [Key]
    public Guid OrderId { get; set; } = Guid.NewGuid(); // Unique identifier for the order

    [Required]
    [ForeignKey("Member")]
    public Guid MemberId { get; set; } // Link to the member who placed the order

    [Required]
    public decimal TotalPrice { get; set; } // Total price of the order after discounts

    [Required]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow; // Date and time when the order was placed

    [Required]
    public string OrderStatus { get; set; } = "Pending"; // Default status is "Pending"

    public virtual ICollection<OrderItemModel> OrderItems { get; set; } = new List<OrderItemModel>(); // List of items in the order
}

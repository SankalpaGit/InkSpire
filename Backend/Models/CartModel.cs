using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Backend.Models;

public class CartModel
{   
    [Key]
    public Guid CartId { get; set; } // Primary key for the cart

    [Required]
    [ForeignKey("Member")]
    public Guid MemberId { get; set; } // Foreign key to the MemberModel

    public virtual ICollection<CartItemModel> CartItems { get; set; } = new List<CartItemModel>(); // Navigation property for related cart items
}

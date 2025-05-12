using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public StatsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")] // Only admins can access this
        public IActionResult GetDashboardStats()
        {
            try
            {
                // Total staff count
                var totalStaff = _dbContext.Staffs.Count();

                // Total books count
                var totalBooks = _dbContext.Books.Count();

                // Total sales amount (sum of total price of completed orders)
                var totalSalesAmount = _dbContext.Orders
                    .Where(o => o.OrderStatus == "Complete")
                    .Sum(o => (decimal?)o.TotalPrice) ?? 0;

                // Total quantity of all available books combined
                var totalAvailableQuantity = _dbContext.Books.Sum(b => b.StockQuantity);

                return Ok(new
                {
                    TotalStaff = totalStaff,
                    TotalBooks = totalBooks,
                    TotalSalesAmount = totalSalesAmount,
                    TotalAvailableQuantity = totalAvailableQuantity
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving stats.", Details = ex.Message });
            }
        }

        [HttpGet("sales/day")]
        [Authorize(Roles = "Admin")] // Only admins can access this
        public IActionResult GetSalesByDay()
        {
            try
            {
                var salesByDay = _dbContext.Orders
                    .Where(o => o.OrderStatus == "Complete")
                    .GroupBy(o => o.OrderDate.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        TotalSales = g.Sum(o => o.TotalPrice)
                    })
                    .OrderBy(g => g.Date)
                    .ToList();

                return Ok(new { Message = "Sales by day retrieved successfully.", Data = salesByDay });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving sales data.", Details = ex.Message });
            }
        }
    }
}
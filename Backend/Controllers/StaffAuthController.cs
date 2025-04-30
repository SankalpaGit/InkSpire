using Backend.Models;
using Backend.Services;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StaffAuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly JwtService _jwtService;
    private readonly HashedPassword _hashedPassword;

    public StaffAuthController(AppDbContext dbContext, JwtService jwtService, HashedPassword hashedPassword)
    {
        _dbContext = dbContext;
        _jwtService = jwtService;
        _hashedPassword = hashedPassword;
    }

    // Admin adds a new staff (registration)
    [HttpPost("register")]
    [Authorize(Roles = "Admin")] // Only admins can register staff
    public IActionResult RegisterStaff([FromBody] StaffModel model)
    {
        // Validate if the email already exists
        if (_dbContext.Staffs.Any(s => s.Email == model.Email))
        {
            return BadRequest(new { Message = "A staff member with this email already exists." });
        }

        // Hash the password
        model.Password = _hashedPassword.HashPassword(model.Password);

        // Add the staff to the database
        model.Id = Guid.NewGuid();
        _dbContext.Staffs.Add(model);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Staff registered successfully." });
    }

    // Staff login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestModel model)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { Message = "Email and password are required." });
        }

        // Find the staff by email
        var staff = _dbContext.Staffs.FirstOrDefault(s => s.Email == model.Email);

        if (staff == null || !_hashedPassword.VerifyPassword(model.Password, staff.Password))
        {
            return Unauthorized(new { Message = "Invalid email or password." });
        }

        // Generate JWT token
        var token = _jwtService.GenerateToken(staff.Id, staff.Email, "Staff");

        return Ok(new { Token = token });
    }
}

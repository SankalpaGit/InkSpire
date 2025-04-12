using Backend.Models;
using Backend.Services;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StaffController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly HashedPassword _hashedPassword;
    private readonly AppDbContext _dbContext;

    public StaffController(JwtService jwtService, HashedPassword hashedPassword, AppDbContext dbContext)
    {
        _jwtService = jwtService;
        _hashedPassword = hashedPassword;
        _dbContext = dbContext;
    }

    [HttpPost("add")]
    [Authorize] // Only admins can add staff
    public IActionResult AddStaff([FromBody] RegisterRequestModel model)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.FirstName) || string.IsNullOrWhiteSpace(model.LastName) ||
            string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { Message = "All fields are required." });
        }

        // Check if email is already registered
        if (_dbContext.Staffs.Any(s => s.Email == model.Email))
        {
            return BadRequest(new { Message = "Email is already registered." });
        }

        // Map RegisterRequestModel to StaffModel
        var staff = new StaffModel
        {
            Id = Guid.NewGuid(),
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            Password = _hashedPassword.HashPassword(model.Password)
        };

        // Save the staff to the database
        _dbContext.Staffs.Add(staff);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Staff added successfully." });
    }

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
        var token = _jwtService.GenerateToken(staff.Id, staff.Email);

        return Ok(new { Token = token });
    }
}
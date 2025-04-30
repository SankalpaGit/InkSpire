using Backend.Models;
using Backend.Services;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminAuthController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly AppDbContext _dbContext;

    public AdminAuthController(JwtService jwtService, AppDbContext dbContext)
    {
        _jwtService = jwtService;
        _dbContext = dbContext;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestModel model)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { Message = "Email and password are required." });
        }

        // Find the admin by email
        var admin = _dbContext.Admins.FirstOrDefault(a => a.Email == model.Email);

        if (admin == null || admin.Password != model.Password)
        {
            return Unauthorized(new { Message = "Invalid email or password." });
        }

        // Generate JWT token
        var token = _jwtService.GenerateToken(admin.Id, admin.Email, "Admin");

        return Ok(new { Token = token });
    }
}
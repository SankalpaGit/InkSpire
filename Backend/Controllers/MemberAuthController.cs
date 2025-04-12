using Backend.Models;
using Backend.Services;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MemberAuthController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly HashedPassword _hashedPassword;
    private readonly AppDbContext _dbContext;

    public MemberAuthController(JwtService jwtService, HashedPassword hashedPassword, AppDbContext dbContext)
    {
        _jwtService = jwtService;
        _hashedPassword = hashedPassword;
        _dbContext = dbContext;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequestModel model)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.FirstName) || string.IsNullOrWhiteSpace(model.LastName) ||
            string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { Message = "All fields are required." });
        }

        // Check if email is already registered
        if (_dbContext.Members.Any(m => m.Email == model.Email))
        {
            return BadRequest(new { Message = "Email is already registered." });
        }

        // Map RegisterRequestModel to MemberModel
        var member = new MemberModel
        {
            Id = Guid.NewGuid(), // Generate a new GUID for the member ID
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            Password = _hashedPassword.HashPassword(model.Password) // Hash the password
        };

     

        // Hash the password before storing it
        model.Password = _hashedPassword.HashPassword(model.Password);

        // Save the member to the database
        _dbContext.Members.Add(member);
        _dbContext.SaveChanges();

        return Ok(new { Message = "Registration successful." });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestModel model)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { Message = "Email and password are required." });
        }

        // Find the member by email
        var member = _dbContext.Members.FirstOrDefault(m => m.Email == model.Email);

        if (member == null || !_hashedPassword.VerifyPassword(model.Password, member.Password))
        {
            return Unauthorized(new { Message = "Invalid email or password." });
        }

        // Generate JWT token
        var token = _jwtService.GenerateToken(member.Id, member.Email);

        return Ok(new { Token = token });
    }
}
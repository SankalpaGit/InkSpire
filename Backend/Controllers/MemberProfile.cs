using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberProfile : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly HashedPassword _hashedPassword;

        public MemberProfile(AppDbContext context, HashedPassword hashedPassword)
        {
            _context = context;
            _hashedPassword = hashedPassword;
        }

        // API to fetch member's first name, last name, and email using claims
        [HttpGet("details")]
        public async Task<IActionResult> GetMemberDetails()
        {
            // Extract the member ID from the JWT claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var memberId))
            {
                return Unauthorized("Invalid token or member ID not found.");
            }

            var member = await _context.Members
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == memberId);

            if (member == null)
            {
                return NotFound("Member not found.");
            }

            return Ok(new
            {
                member.FirstName,
                member.LastName,
                member.Email
            });
        }

        // API to change a member's password using claims
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6 || request.NewPassword.Length > 100)
            {
                return BadRequest("Password must be between 6 and 100 characters.");
            }

            // Extract the member ID from the JWT claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var memberId))
            {
                return Unauthorized("Invalid token or member ID not found.");
            }

            var member = await _context.Members.FirstOrDefaultAsync(m => m.Id == memberId);
            if (member == null)
            {
                return NotFound("Member not found.");
            }

            // Hash the new password before saving
            var hashedNewPassword = _hashedPassword.HashPassword(request.NewPassword);
            member.Password = hashedNewPassword;

            _context.Members.Update(member);
            await _context.SaveChangesAsync();

            return Ok("Password updated successfully.");
        }
    }

    public class ChangePasswordRequest
    {
        public string NewPassword { get; set; }
    }
}

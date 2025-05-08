using Backend.Data;
using Backend.Hubs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnnouncementController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<AnnouncementHub> _hubContext;

    public AnnouncementController(AppDbContext dbContext, IHubContext<AnnouncementHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [HttpPost("create")]
    [Authorize(Roles = "Admin")] // Only allow admins to create announcements
    public async Task<IActionResult> CreateAnnouncement([FromBody] AnnouncementModel announcement)
    {
        if (string.IsNullOrEmpty(announcement.Message))
        {
            return BadRequest(new { Message = "Announcement message cannot be empty." });
        }

        announcement.CreatedAt = DateTime.UtcNow;
        _dbContext.Announcements.Add(announcement);
        await _dbContext.SaveChangesAsync();

        // Broadcast the announcement to all connected clients
        await _hubContext.Clients.All.SendAsync("ReceiveAnnouncement", announcement.Message);

        return Ok(new { Message = "Announcement created successfully.", Announcement = announcement });
    }

    [HttpGet("all")]
    public IActionResult GetAllAnnouncements()
    {
        var announcements = _dbContext.Announcements
            .Where(a => a.ExpiresAt > DateTime.UtcNow) 
            .ToList();

        return Ok(new { Announcements = announcements });
    }
}

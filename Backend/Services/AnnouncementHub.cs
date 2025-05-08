using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class AnnouncementHub : Hub
{
    // This method will be called to broadcast announcements to all connected clients
    public async Task BroadcastAnnouncement(string message)
    {
        await Clients.All.SendAsync("ReceiveAnnouncement", message);
    }
}
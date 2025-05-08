using System;
using Backend.Data;
using Microsoft.Extensions.Hosting;

namespace Backend.Services;

public class AnnouncementCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public AnnouncementCleanupService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Remove expired announcements
                var expiredAnnouncements = dbContext.Announcements
                    .Where(a => a.ExpiresAt <= DateTime.UtcNow)
                    .ToList();

                if (expiredAnnouncements.Any())
                {
                    dbContext.Announcements.RemoveRange(expiredAnnouncements);
                    await dbContext.SaveChangesAsync();
                }
            }

            // Wait for 1 hour before checking again
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}

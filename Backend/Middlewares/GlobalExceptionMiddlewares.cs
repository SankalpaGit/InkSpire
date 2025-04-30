using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
    public class GlobalExceptionMiddlewares
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddlewares> _logger;

        public GlobalExceptionMiddlewares(RequestDelegate next, ILogger<GlobalExceptionMiddlewares> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");

                // Log to file
                LogErrorToFile(ex);

                context.Response.ContentType = "application/json";

                switch (ex)
                {
                    case ArgumentException:
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsync("Bad request. Check your inputs.");
                        break;

                    case UnauthorizedAccessException:
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsync("Unauthorized access.");
                        break;

                    case DbUpdateException:
                        context.Response.StatusCode = StatusCodes.Status409Conflict;
                        await context.Response.WriteAsync("Database update failed.");
                        break;

                    default:
                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        await context.Response.WriteAsync("An unexpected error occurred. Please try again later.");
                        break;
                }
            }
        }

        private void LogErrorToFile(Exception ex)
        {
            var logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "ErrorLogs.txt");

            var logText = $"[{DateTime.Now:dd-MM-yyyy hh:mm tt}] Error: {ex.GetType().Name} - {ex.Message}{Environment.NewLine}StackTrace: {ex.StackTrace}{Environment.NewLine}";

            using (var writer = File.AppendText(logFilePath))
            {
                writer.WriteLine(logText);
            }
        }
    }
}


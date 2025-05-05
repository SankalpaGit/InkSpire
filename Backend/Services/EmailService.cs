using System;
using System.Net.Mail;

namespace Backend.Services;

public class EmailService
{
    public void SendEmail(string toEmail, string subject, string body)
    {
        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new System.Net.NetworkCredential("joshisankalpa2@gmail.com", "pcee bzmf shst yjuh"), // Use your Gmail and App Password
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("joshisankalpa2@gmail.com"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(toEmail);

        smtpClient.Send(mailMessage);
    }
}
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface BookingConfirmationParams {
  to: string;
  customerName: string;
  serviceName: string;
  employeeName: string;
  date: string; // Formatted date string
  time: string; // Formatted time string
  duration: number; // Duration in minutes
  phone?: string;
}

let transporter: Transporter | null = null;

/**
 * Get and validate email configuration from environment variables
 */
function getEmailConfig(): EmailConfig | null {
  const provider = process.env.EMAIL_PROVIDER;
  
  // Currently only SMTP is supported
  if (provider !== "smtp") {
    return null;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const username = process.env.SMTP_USERNAME;
  const password = process.env.SMTP_PASSWORD;
  const useTLS = process.env.SMTP_USE_TLS === "True" || process.env.SMTP_USE_TLS === "true";

  if (!host || !port || !username || !password) {
    return null;
  }

  const portNumber = parseInt(port, 10);
  if (isNaN(portNumber)) {
    console.error("Invalid SMTP_PORT:", port);
    return null;
  }

  // Port 465 uses SSL (secure: true), port 587 uses STARTTLS (secure: false)
  const secure = portNumber === 465;

  return {
    host,
    port: portNumber,
    secure,
    auth: {
      user: username,
      pass: password,
    },
  };
}

/**
 * Initialize the email transporter
 */
function getTransporter(): Transporter | null {
  if (transporter) {
    return transporter;
  }

  const config = getEmailConfig();
  if (!config) {
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
      // For port 587, we need to explicitly enable STARTTLS
      ...(config.port === 587 && {
        requireTLS: true,
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates if needed
        },
      }),
    });

    return transporter;
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    return null;
  }
}

/**
 * Check if email is properly configured
 */
export function isEmailConfigured(): boolean {
  return getEmailConfig() !== null;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  params: BookingConfirmationParams
): Promise<void> {
  const { to, customerName, serviceName, employeeName, date, time, duration, phone } = params;

  const emailTransporter = getTransporter();
  if (!emailTransporter) {
    throw new Error("Email is not configured. Please set SMTP environment variables.");
  }

  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USERNAME || "noreply@example.com";
  const fromName = process.env.SMTP_FROM_NAME || "Swapna Beauty Parlour";

  // HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
    }
    .content h2 {
      color: #8B4513;
      margin-top: 0;
      font-size: 24px;
    }
    .appointment-details {
      background: #f9f9f9;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #D4AF37;
      border-radius: 4px;
    }
    .appointment-details h3 {
      margin-top: 0;
      color: #8B4513;
      font-size: 18px;
    }
    .appointment-details p {
      margin: 10px 0;
      font-size: 16px;
    }
    .appointment-details strong {
      color: #8B4513;
      display: inline-block;
      min-width: 100px;
    }
    .contact-info {
      background: #fff8e1;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      border: 1px solid #D4AF37;
    }
    .contact-info p {
      margin: 5px 0;
    }
    .contact-info a {
      color: #8B4513;
      text-decoration: none;
      font-weight: bold;
    }
    .contact-info a:hover {
      text-decoration: underline;
    }
    .footer {
      background: #f4f4f4;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #ddd;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #D4AF37;
      color: #8B4513;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 10px;
    }
    .button:hover {
      background-color: #C9A227;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Swapna Beauty Parlour</h1>
    </div>
    <div class="content">
      <h2>Appointment Confirmed! ✨</h2>
      <p>Dear ${customerName},</p>
      <p>Your appointment has been successfully booked. We look forward to seeing you!</p>
      
      <div class="appointment-details">
        <h3>📅 Appointment Details</h3>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Stylist:</strong> ${employeeName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      </div>
      
      <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
      
      <div class="contact-info">
        <p><strong>📞 Contact Us:</strong></p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/17705591521">Click here to message us</a></p>
      </div>
      
      <p style="margin-top: 20px;">We can't wait to serve you!</p>
    </div>
    <div class="footer">
      <p><strong>Swapna Beauty Parlour</strong></p>
      <p>Thank you for choosing us!</p>
      <p style="margin-top: 10px; font-size: 11px; color: #999;">
        This is an automated confirmation email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  // Plain text version for email clients that don't support HTML
  const textContent = `
Swapna Beauty Parlour - Appointment Confirmation

Dear ${customerName},

Your appointment has been successfully booked. We look forward to seeing you!

APPOINTMENT DETAILS:
Service: ${serviceName}
Stylist: ${employeeName}
Date: ${date}
Time: ${time}
Duration: ${duration} minutes

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

CONTACT US:
${phone ? `Phone: ${phone}\n` : ""}WhatsApp: https://wa.me/17705591521

Thank you for choosing Swapna Beauty Parlour!
  `.trim();

  try {
    await emailTransporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: "Appointment Confirmed - Swapna Beauty Parlour",
      text: textContent,
      html: htmlContent,
    });

    console.log(`Confirmation email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send confirmation email to ${to}:`, error);
    throw error;
  }
}

/**
 * Verify email configuration by sending a test email
 */
export async function verifyEmailConfig(testRecipient?: string): Promise<boolean> {
  const emailTransporter = getTransporter();
  if (!emailTransporter) {
    return false;
  }

  try {
    await emailTransporter.verify();
    return true;
  } catch (error) {
    console.error("Email configuration verification failed:", error);
    return false;
  }
}

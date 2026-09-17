// Usernames are user input, so escape them before putting them in email HTML
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const welcomeEmailTemplate = (username, verificationUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Bodha AI</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f7f6;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 20px;
      color: #1f2937;
    }
    .message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #4b5563;
    }
    .cta-container {
      text-align: center;
      margin-bottom: 30px;
      margin-top: 30px;
    }
    .cta-button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #4338ca;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .contact-link {
      color: #4f46e5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Bodha AI</h1>
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${escapeHtml(username)},</h2>
        <p class="message">
          Welcome to Bodha AI! We're absolutely thrilled to have you join our community. Your account has successfully been created. Please verify your email address to get started.
        </p>
        <div class="cta-container">
          <a href="${escapeHtml(verificationUrl)}" class="cta-button">Verify Email</a>
        </div>
        <p class="message">
          If you have any questions, need help getting started, or just want to say hi, feel free to reply to this email. Our support team is always here for you.
        </p>
      </div>
      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} Bodha AI. All rights reserved.<br>
          Need help? <a href="mailto:support@bodha.ai" class="contact-link">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const emailVerifiedTemplate = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified - Bodha AI</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          background-color: #f4f7f6;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        .icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 20px;
          font-size: 36px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        h1 {
          color: #1f2937;
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 24px;
        }
        p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">✓</div>
        <h1>Email Verified!</h1>
        <p>Thank you for verifying your email. Your Bodha AI account is now active and ready to use.</p>
        <a href="/login" class="btn">Go to Login</a>
      </div>
    </body>
    </html>
    `;
};

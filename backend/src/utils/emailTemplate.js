export const welcomeEmailTemplate = (username) => {
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
        <h2 class="greeting">Hello ${username},</h2>
        <p class="message">
          Welcome to Bodha AI! We're absolutely thrilled to have you join our community. Your account has successfully been created, and you're now ready to explore all the features and possibilities we have to offer.
        </p>
        <div class="cta-container">
          <a href="https://bodha.ai/dashboard" class="cta-button">Get Started Now</a>
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

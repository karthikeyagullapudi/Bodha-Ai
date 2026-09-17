import nodemailer from 'nodemailer';

// Render's free plan blocks outgoing SMTP connections, so mail is sent through
// the Gmail HTTP API instead. Nodemailer is only used to build the raw message.
const composer = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
});

const getAccessToken = async () => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Google OAuth error: ${data.error}${data.error_description ? ` (${data.error_description})` : ''}`,
    );
  }

  return data.access_token;
};

// Check the credentials once at startup so a broken email setup shows up in
// the logs straight away
getAccessToken()
  .then(() => {
    console.log('Email service is ready to send emails');
  })
  .catch((error) => {
    console.log('Error in email service', error.message);
  });

// Resolves to true when the email was accepted by Gmail, false otherwise
export const sendMail = async (to, subject, html, text) => {
  try {
    const { message } = await composer.sendMail({
      from: process.env.GOOGLE_USER,
      to: to,
      subject: subject,
      html: html,
      text: text,
    });

    const accessToken = await getAccessToken();
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: message.toString('base64url') }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gmail API error ${response.status}: ${(await response.text()).slice(0, 300)}`,
      );
    }

    const details = await response.json();
    console.log('Email sent successfully', details.id);
    return true;
  } catch (error) {
    console.log('Error in sending mail', error);
    return false;
  }
};

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});

transporter
  .verify()
  .then(() => {
    console.log('Email transporter is ready to send emails');
  })
  .catch((error) => {
    console.log('Error in email transporter', error);
  });

export const sendMail = async (to, subject, html, text) => {
  try {
    const emailOptions = {
      from: process.env.GOOGLE_USER,
      to: to,
      subject: subject,
      html: html,
      text: text,
    };

    const details = await transporter.sendMail(emailOptions);
    console.log('Email sent successfully', details);
  } catch (error) {
    console.log('Error in sending mail', error);
  }
};

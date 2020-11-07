const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = '';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: 'andrew@mead.io',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
}

const sendCancelationEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: 'andrew@mead.io',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope top see you back soon.`,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
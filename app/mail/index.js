const { createTransport } = require('nodemailer');
const { host, port, user, pass } = require('../config').mail;

const transport = createTransport({
  host,
  port,
  secure: false,
  auth: {
    user,
    pass,
  },
});

// TODO: Implement a HTML template for emails
module.exports = async (from, to, subject, text) => {
  await transport.sendMail({
    from,
    to,
    subject,
    text,
  });
  console.log(`Email sent from ${from} to ${to}`);
};

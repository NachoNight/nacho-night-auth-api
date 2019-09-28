/*
  This module is resposible for sending out emails.
  Currently, the HTML template is missing, and will be
  until the template has been discussed. Exported, will be
  the function which will take in parameters necessary to send
  out an email.

  Regarding the imports, the mail object within the config file
  consists of all the required SMTP information we need to
  run Nodemailer.
*/
const { createTransport } = require('nodemailer');
const { host, port, user, pass, sender } = require('../config').mail;

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
module.exports = async (to, subject, text) => {
  await transport.sendMail({
    from: sender,
    to,
    subject,
    text,
  });
  console.log(`Email sent to ${to}`);
};

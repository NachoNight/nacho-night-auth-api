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
const ejs = require('ejs');
const path = require('path');
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

// TODO: Create templates for different use cases
module.exports = (to, subject, text, template = 'sample') => {
  const config = {
    from: sender,
    to,
    subject,
  };
  ejs.renderFile(
    path.join(__dirname, `/templates/${template}.ejs`),
    { ...config, body: text },
    async (err, data) => {
      if (err) throw err;
      await transport.sendMail({
        ...config,
        html: data,
      });
      console.log(`Email sent to ${to}`);
    },
  );
};

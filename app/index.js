const server = require('./server');
const sendMail = require('./mail');

server.start();
sendMail('denis_onder@protonmail.com', 'Testing', 'Hello gmem');

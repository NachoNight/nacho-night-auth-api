/*
  List routes in the exported function
  The controller methods handle the logic
*/
const passport = require('passport');
const controller = require('./controller');
const validateInput = require('./middleware/validateInput');

module.exports = (app) => {
  app.get('/', (_, res) => {
    res.send('NachoNight Authentication API');
  });
  app.post('/register', validateInput, (req, res) => {
    controller.register(req, res);
  });
  app.get('/verify-account/:token', (req, res) => {
    controller.verifyAccount(req, res);
  });
  app.post('/add-address', (req, res) => {
    controller.addAddress(req, res);
  });
  app.post('/login', validateInput, (req, res) => {
    controller.login(req, res);
  });
  app.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    controller.current(req, res);
  });
  app.delete('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
    controller.delete(req, res);
  });
  app.patch('/forgot', validateInput, (req, res) => {
    controller.forgot(req, res);
  });
  app.patch('/recover/:token', validateInput, (req, res) => {
    controller.recover(req, res);
  });
  app.put('/change-email', passport.authenticate('jwt', { session: false }), (req, res) => {
    controller.changeEmail(req, res);
  });
  app.get('/verify-email-change/:token', (req, res) => {
    controller.verifyEmailChange(req, res);
  });
  app.put('/change-password', passport.authenticate('jwt', { session: false }), (req, res) => {
    controller.changePassword(req, res);
  });
};

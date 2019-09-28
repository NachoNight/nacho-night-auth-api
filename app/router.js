/*
  List routes in the exported function
  The controller methods handle the logic
*/
const passport = require('passport');
const controller = require('./controller');
const validateInput = require('./middleware/validateInput');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('NachoNight Authentication API');
  });
  app.post('/register', validateInput, (req, res) => {
    controller.register(req, res);
  });
  app.post('/login', validateInput, (req, res) => {
    controller.login(req, res);
  });
  app.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    controller.current(req, res);
  });
  /* TODO: Implement this endpoint once the mail system is in place
    app.put("/edit", passport.authenticate("jwt", { session: false }),
    validateInput, (req, res) => controller.edit(req, res));
  */
  app.delete('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
    controller.delete(req, res);
  });
  app.post('/forgot', (req, res) => {
    controller.forgot(req, res);
  });
  app.get('/reset/:token', (req, res) => {
    controller.reset(req, res);
  });
};

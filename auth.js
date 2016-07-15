function setupAuth(User, app) {
  var passport = require('passport');
  var BearerStrategy = require('passport-http-bearer').Strategy;

  passport.use(new BearerStrategy(
    function(token, done) {
      // asynchronous validation, for effect...
      process.nextTick(function() {
        User.findOne({'token': token}).
        exec(function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    }
  ));

  app.use(passport.initialize());
}

module.exports = setupAuth;

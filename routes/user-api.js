var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var log = require('log4js').getLogger("user");
var passport = require('passport');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json({limit: '5mb'}));

  // User API
  api.get('/:name', passport.authenticate('bearer', {session: false}), wagner.invoke(function(User) {
    return function(req, res) {
      User.findOne({username: req.params.name}, function(error, user) {
        if (error) {
          log.error(error.toString());
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!user) {
          return res.
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        res.json({user: user});
      });
    };
  }));

  api.post('/login', passport.authenticate('bearer', {session: false}), wagner.invoke(function(User) {
    return function(req, res) {
      var user = req.body.user;
      User.findOne({username: user.username}, function(error, data) {
        if (error) {
          log.error(error.toString());
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!data) {
          return res.json({ error: 'Not found' });
        }
        if (user.username === data.username && user.password === data.password) {
          res.json({user: data});
        } else {
          return res.json({ error: 'Not found' });
        }
      });
    };
  }));

  return api;
};

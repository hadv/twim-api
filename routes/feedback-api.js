var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var log = require('log4js').getLogger("feedback");
var passport = require('passport');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json({limit: '2mb'}));

  // Feedback API
  api.get('/userid/:id/:last_updated_date', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Feedback) {
    return function(req, res) {
      var date = new Date(new Number(req.params.last_updated_date));
      Feedback.find(
        {
          $or: [
            {
              rater: req.params.id
            },
            {
              ratee: req.params.id
            }
          ],
          updated_at: {$gt: date}
        }).
        exec(function(error, feedbacks) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if (!feedbacks) {
            return res.
              status(status.NOT_FOUND).
              json({ error: 'Not found' });
          }
          res.json(feedbacks);
      });
    };
  }));

  api.get('/ratee/:id/:last_updated_date', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Feedback) {
    return function(req, res) {
      var date = new Date(new Number(req.params.last_updated_date));
      Feedback.find(
        {
          ratee: req.params.id,
          updated_at: {$gt: date}
        }).
        exec(function(error, feedbacks) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if (!feedbacks) {
            return res.
              status(status.NOT_FOUND).
              json({ error: 'Not found' });
          }
          res.json(feedbacks);
      });
    };
  }));

  api.post('/add', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Feedback) {
    return function(req, res) {
      try {
        var feedback = req.body;
        log.debug('req.body feedback: ' + feedback);
      } catch (e) {
        log.error(e);
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'Cannot add feedback at the moment' });
      }
      Feedback.create(feedback, function(error, data) {
        if (error) {
          log.error(error.toString());
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        return res.json(data);
      });
    };
  }));

  return api;
};

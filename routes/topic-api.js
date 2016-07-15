var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var log = require('log4js').getLogger("category");
var passport = require('passport');

module.exports = function(wagner) {
  var api = express.Router();
  api.use(bodyparser.json({limit: '5mb'}));

  api.get('/id/:id', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Topic) {
    return function(req, res) {
      Topic.findOne({_id: req.params.id}, function(error, topic) {
        if (error) {
          log.error(error.toString());
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!topic) {
          return res.
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        res.json(topic);
      });
    };
  }));

  api.get('/list/:category_id/:last_updated_date', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Topic) {
    return function(req, res) {
      var date = new Date(new Number(req.params.last_updated_date));
      Topic.
        find({category: req.params.category_id, updated_at: {$gt: date}}).
        sort({_id: 1}).
        exec(function(error, topics) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if (!topics) {
            return res.
              status(status.NOT_FOUND).
              json({ error: 'Not found' });
          }
          res.json(topics);
        });
    };
  }));

  api.get('/list', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Topic) {
    return function(req, res) {
      Topic.
        find().
        sort({_id: 1}).
        exec(function(error, topics) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if (!topics) {
            return res.
              status(status.NOT_FOUND).
              json({ error: 'Not found' });
          }
          res.json({topics: topics});
        });
    };
  }));

  api.post('/add', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Topic) {
    return function(req, res) {
      try {
        var topic = req.body.topic;
      } catch (e) {
        log.error(e);
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'Cannot create new topic, please contact to admin for detail information.' });
      }
      Topic.create(topic,
        function(error, data) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          return res.json({ topic: data });
        }
      );
    };
  }));

  api.put('/id/:id', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Topic) {
    return function(req, res) {
      try {
        var topic = req.body.topic;
      } catch (e) {
        log.error(e);
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'topic has deleted or not existed!' });
      }
      Topic.findOneAndUpdate(
        {'_id': topic._id},
        {
          $set: {
            'title': topic.title,
            'icon': topic.icon,
            'short_desc': topic.short_desc,
            'description': topic.description,
            'category': topic.category,
            'disp_order': topic.disp_order,
            'updated_at': new Date()
          }
        },
        {
          'new': true,
          upsert: true,
          runValidators: true
        },
        function(error, data) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          return res.json({ topic: data });
        }
      );
    };
  }));

  api.delete('/id/:id', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Topic) {
    return function(req, res) {
      try {
        Topic.findOneAndRemove(
          { _id: req.params.id },
          function(error) {
            if (error) {
              log.error(error.toString());
              return res.
                status(status.INTERNAL_SERVER_ERROR).
                json({ error: error.toString() });
            }
            return res.
              status(status.OK).json();
          }
        );
      } catch (e) {
        log.error(e);
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'Cannot delete topic' });
      };
    };
  }));

  return api;
}

var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var log = require('log4js').getLogger("category");
var passport = require('passport');

module.exports = function(wagner) {
  var api = express.Router();
  api.use(bodyparser.json({limit: '5mb'}));

  // Category API
  api.get('/id/:id', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Category) {
    return function(req, res) {
      Category.findOne({_id: req.params.id}, function(error, category) {
        if (error) {
          log.error(error.toString());
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!category) {
          return res.
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        res.json({category: category});
      });
    };
  }));

  api.get('/list', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
        find(function(error, categories) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if (!categories) {
            return res.
              status(status.NOT_FOUND).
              json({ error: 'Not found' });
          }
          res.json({categories: categories});
        });
    };
  }));

  api.get('/list/:last_updated_date', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Category) {
    return function(req, res) {
      var date = new Date(new Number(req.params.last_updated_date));
      Category.
        find({updated_at: {$gt: date}}).
        exec(function(error, categories) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if (!categories) {
            return res.
              status(status.NOT_FOUND).
              json({ error: 'Not found' });
          }
          res.json(categories);
        });
    };
  }));

  api.put('/id/:id', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Category) {
    return function(req, res) {
      try {
        var category = req.body.category;
      } catch (e) {
        log.error(e);
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'category has deleted or not existed!' });
      }
      Category.findOneAndUpdate(
        {'_id': category._id},
        {
          $set: {
            'name': category.name,
            'icon': category.icon,
            'description': category.description,
            'level': category.level,
            'disp_order': category.disp_order,
            'updated_at': new Date()
          }
        },
        {
          'new': true,
          upsert: true,
          runValidators: true
        },
        function(error, category) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          return res.json({ category: category });
        }
      );
    };
  }));

  api.post('/add', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Category) {
    return function(req, res) {
      try {
        var category = req.body.category;
      } catch (e) {
        log.error(e);
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'Cannot create new category, please contact to admin for detail information.' });
      }
      Category.create(category,
        function(error, category) {
          if (error) {
            log.error(error.toString());
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          return res.json({ category: category });
        }
      );
    };
  }));

  api.delete('/id/:id', passport.authenticate('bearer', {session: false}), wagner.invoke(function(Category) {
    return function(req, res) {
      try {
        Category.findOneAndRemove(
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
          json({ error: 'Cannot delete category' });
      };
    };
  }));

  return api;
};

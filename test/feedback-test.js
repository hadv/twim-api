var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Feedback API', function() {
  var server;
  var Feedback;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('../models/models')(wagner);
    app.use(require('../routes/feedback-api')(wagner));
    wagner.invoke(require('../auth'), { app: app });

    server = app.listen(3000);

    // Make Feedback model available in tests
    Feedback = models.Feedback;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure feedbacks are empty before each test
    Feedback.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });

  it('can load feedbacks by userid', function(done) {
    var feedbacks = [
      {
        talk: 'Electronics',
        topic: 'Talking about all the electricity devices.',
        rater: 'hadv',
        ratee: 'kk',
        feedbacks: [
          {
            title: 'grammar',
            point: 5,
            note: 'So good! <3'
          },
          {
            title: 'pronoucian',
            point: 10,
            note: 'Pfffff! (y)'
          }
        ]
      },
      {
        talk: 'Laptops',
        topic: 'Talking about all the electricity devices.',
        rater: 'kk',
        ratee: 'hadv',
        feedbacks: [
          {
            title: 'grammar',
            point: 1,
            note: 'So poor! <3'
          },
          {
            title: 'pronoucian',
            point: 2,
            note: 'so sad! :('
          }
        ]
      }
    ];

    // Create 2 feedbacks
    Feedback.create(feedbacks, function(error, feedbacks) {
      var now = new Date();
      var date = new Date(now.getTime() - 5*60*1000);
      var url = URL_ROOT + '/userid/hadv/' + date.getTime();
      // Make an HTTP request to localhost:3000/feedback/userid/hadv/0
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.length, 2);
        assert.equal(result[0].talk, 'Electronics');
        assert.equal(result[1].talk, 'Laptops');
        done();
      });
    });
  });

  it('can load feedbacks by ratee', function(done) {
    var feedbacks = [
      {
        talk: 'Electronics',
        topic: 'Talking about all the electricity devices.',
        rater: 'hadv',
        ratee: 'kk',
        feedbacks: [
          {
            title: 'grammar',
            point: 5,
            note: 'So good! <3'
          },
          {
            title: 'pronoucian',
            point: 10,
            note: 'Pfffff! (y)'
          }
        ]
      },
      {
        talk: 'Laptops',
        topic: 'Talking about all the electricity devices.',
        rater: 'kk',
        ratee: 'hadv',
        feedbacks: [
          {
            title: 'grammar',
            point: 1,
            note: 'So poor! <3'
          },
          {
            title: 'pronoucian',
            point: 2,
            note: 'so sad! :('
          }
        ]
      }
    ];

    // Create 2 feedbacks
    Feedback.create(feedbacks, function(error, feedbacks) {
      var now = new Date();
      var date = new Date(now.getTime() - 5*60*1000);
      var url = URL_ROOT + '/ratee/hadv/' + date.getTime();
      // Make an HTTP request to localhost:3000/feedback/userid/hadv/0
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.length, 1);
        assert.equal(result[0].talk, 'Laptops');
        done();
      });
    });
  });

});

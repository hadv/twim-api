var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('User API', function() {
  var server;
  var User;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('../models/models')(wagner);
    app.use(require('../routes/user-api')(wagner));
    wagner.invoke(require('../auth'), { app: app });

    server = app.listen(3000);

    // Make User model available in tests
    User = models.User;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure users are empty before each test
    User.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });

  it('can load user by username', function(done) {
    var user = {
      username: 'admin',
      password: 'i3nxx1rk',
      token: 'suMwoiihHZkYuYq',
      email: 'master@eagri.vn',
      firstname: 'Twim',
      lastname: 'TWIM'
    };

    // Create 4 categories
    User.create(user, function(error, user) {
      var url = URL_ROOT + '/admin';
      // Make an HTTP request to localhost:3000/user/hadv
      var agent = superagent.agent();
      agent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.user.username, 'admin');
        assert.equal(result.user.firstname, 'Twim');
        assert.equal(result.user.lastname, 'TWIM');
        assert.equal(result.user.token, 'suMwoiihHZkYuYq');
        assert.equal(result.user.email, 'master@eagri.vn');
        done();
      });
    });
  });

  it('can login with username/password', function(done) {
    var user = {
      username: 'admin',
      password: 'i3nxx1rk',
      token: 'suMwoiihHZkYuYq',
      email: 'master@eagri.vn',
      firstname: 'Twim',
      lastname: 'TWIM'
    };

    // Create 4 categories
    User.create(user, function(error, user) {
      var url = URL_ROOT + '/login';
      // Make an HTTP request to localhost:3000/user/hadv
      var agent = superagent.agent();
      agent.post(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .send({user: {username: 'admin', password: 'i3nxx1rk'}})
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.user.username, 'admin');
        assert.equal(result.user.firstname, 'Twim');
        assert.equal(result.user.lastname, 'TWIM');
        assert.equal(result.user.token, 'suMwoiihHZkYuYq');
        assert.equal(result.user.email, 'master@eagri.vn');
        done();
      });
    });
  });

  it('Cannot login because of wrong password', function(done) {
    var users = [
      {
        username: 'admin',
        password: 'i3nxx1rk',
        token: 'suMwoiihHZkYuYq',
        email: 'master@eagri.vn',
        firstname: 'Twim',
        lastname: 'Administrator'
      },
      {
        username: 'thao',
        password: 'thao123',
        token: 'aaaaaaaaaa',
        email: 'thao@eagri.vn',
        firstname: 'Co giao',
        lastname: 'Thao'
      },
      {
        username: 'nga',
        password: 'nga123',
        token: 'bbbbbbbbbbbbb',
        email: 'nga@eagri.vn',
        firstname: 'Co giao',
        lastname: 'Nga'
      }
    ];

    // Create 3 users
    User.create(users, function(error, user) {
      var url = URL_ROOT + '/login';
      // Make an HTTP request to localhost:3000/user/hadv
      var agent = superagent.agent();
      agent.post(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .send({user: {username: 'admin', password: '123456'}})
      .end(function(error, res) {
        // assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.error, 'Not found');
        done();
      });
    });
  });

});

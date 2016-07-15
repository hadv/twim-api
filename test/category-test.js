var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Category API', function() {
  var server;
  var Category;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('../models/models')(wagner);
    app.use(require('../routes/category-api')(wagner));
    wagner.invoke(require('../auth'), { app: app });

    server = app.listen(3000);

    // Make Category model available in tests
    Category = models.Category;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });

  it('can load category by id', function(done) {
    var category = {
      _id: 'Electronics',
      name: 'Electronics',
      description: 'Talking about all the electricity devices.',
      level: 'N1',
      topic_count: 5,
      disp_order: 2
    };

    // Create 4 categories
    Category.create(category, function(error, category) {
      var url = URL_ROOT + '/id/Electronics';
      // Make an HTTP request to localhost:3000/category/id/Electronics
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.category.name, 'Electronics');
        done();
      });
    });
  });

  it('can load all categories', function(done) {
    var categories = [
      { _id: 'Electronics', name: 'Electronics', description: 'Talking about all the electricity devices.', level: 'N1', topic_count: 5, disp_order: 2},
      { _id: 'Phones', name: 'Phones', description: 'smart phones.', level: 'N1', topic_count: 3, disp_order: 1},
      { _id: 'Laptops', name: 'Laptops', description: 'laptop, mackook.', level: 'N3', topic_count: 1, disp_order: 3},
      { _id: 'Bacon', name: 'Bacon', description: 'smart home device protocal.', level: 'N4', topic_count: 10, disp_order: 20}
    ];

    // Create 4 categories
    Category.create(categories, function(error, categories) {
      var url = URL_ROOT + '/list/';
      // Make an HTTP request to localhost:3000/category/list
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.categories.length, 4);

        assert.equal(result.categories[0].name, 'Electronics');
        assert.equal(result.categories[1].name, 'Phones');
        assert.equal(result.categories[2].name, 'Laptops');
        assert.equal(result.categories[3].name, 'Bacon');
        done();
      });
    });
  });

  it('can load all categories', function(done) {
    var categories = [
      { _id: 'Electronics', name: 'Electronics', description: 'Talking about all the electricity devices.', level: 'N1', topic_count: 5, disp_order: 2},
      { _id: 'Phones', name: 'Phones', description: 'smart phones.', level: 'N1', topic_count: 3, disp_order: 1},
      { _id: 'Laptops', name: 'Laptops', description: 'laptop, mackook.', level: 'N3', topic_count: 1, disp_order: 3},
      { _id: 'Bacon', name: 'Bacon', description: 'smart home device protocal.', level: 'N4', topic_count: 10, disp_order: 20}
    ];

    // Create 4 categories
    Category.create(categories, function(error, categories) {
      var now = new Date();
      var date = new Date(now.getTime() - 5*60*1000);
      var url = URL_ROOT + '/list/' + date.getTime();
      // Make an HTTP request to localhost:3000/category/list
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.length, 4);

        assert.equal(result[0].name, 'Electronics');
        assert.equal(result[1].name, 'Phones');
        assert.equal(result[2].name, 'Laptops');
        assert.equal(result[3].name, 'Bacon');
        done();
      });
    });
  });

  it('No new updated category', function(done) {
    var categories = [
      { _id: 'Electronics', name: 'Electronics', description: 'Talking about all the electricity devices.', level: 'N1', topic_count: 5, disp_order: 2},
      { _id: 'Phones', name: 'Phones', description: 'smart phones.', level: 'N1', topic_count: 3, disp_order: 1},
      { _id: 'Laptops', name: 'Laptops', description: 'laptop, mackook.', level: 'N3', topic_count: 1, disp_order: 3},
      { _id: 'Bacon', name: 'Bacon', description: 'smart home device protocal.', level: 'N4', topic_count: 10, disp_order: 20}
    ];

    // Create 4 categories
    Category.create(categories, function(error, categories) {
      var now = new Date();
      var date = new Date(now.getTime() + 5*60*1000);
      var url = URL_ROOT + '/list/' + date.getTime();
      // Make an HTTP request to localhost:3000/category/list
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.length, 0);
        done();
      });
    });
  });
});

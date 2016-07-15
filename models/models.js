var mongoose = require('mongoose');
var category = require('./category');
var topic = require('./topic');
var feedback = require('./feedback');
var user = require('./user');
var _ = require('underscore');

module.exports = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/twim');

    var Category =
      mongoose.model('Category', category, 'categories');

    var Topic =
      mongoose.model('Topic', topic, 'topics');

    var Feedback =
      mongoose.model('Feedback', feedback, 'feedbacks');

    var User =
      mongoose.model('User', user, 'users');

    var models = {
      Category: Category,
      Topic: Topic,
      Feedback: Feedback,
      User: User
    };

    // To ensure DRY-ness, register factories in a loop
    _.each(models, function(value, key) {
      wagner.factory(key, function() {
        return value;
      });
    });

    return models;
};

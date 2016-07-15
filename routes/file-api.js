var express = require('express');
var status = require('http-status');
var fs = require('fs');
var log = require('log4js').getLogger("file");
var passport = require('passport');
var _ = require('underscore');

module.exports = function(wagner) {
  var api = express.Router();

  api.get('/images', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {
    var baseUrl = req.protocol + '://' + req.get('host');
    fs.readdir('../../twimapp/public/upload', function(error, files) {
      if (error) {
        log.error(error.toString());
        return res.
        status(status.NOT_FOUND).
        json({
          error: 'Not found'
        });
      }
      var images = [];
      _.each(files, function(filename) {
        images.push({
          "imageUrl": baseUrl + "/public/upload/" + filename,
          "name": filename,
          "value": baseUrl + "/public/upload/" + filename
        });
      })
      res.json({data: images});
    });
  });

  return api;
};

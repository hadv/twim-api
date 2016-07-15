var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var compression = require('compression');
var wagner = require('wagner-core');

/**
 * make a log directory, just in case it isn't there.
 */
try {
  require('fs').mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

/**
 * Initialise log4js first, so we don't miss any log messages
 */
var log4js = require('log4js');
log4js.configure('./config/log4js.json');

var log = log4js.getLogger("app");

require('./models/models')(wagner);

var app = express();

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(favicon(path.join('../../twimapp', 'public', 'favicon.ico')));
app.use(compression());
wagner.invoke(require('./auth'), { app: app });
app.use('/api/v1/category', require('./routes/category-api')(wagner));
app.use('/api/v1/topic', require('./routes/topic-api')(wagner));
app.use('/api/v1/feedback', require('./routes/feedback-api')(wagner));
app.use('/api/v1/user', require('./routes/user-api')(wagner));
app.use('/api/v1/file', require('./routes/file-api')(wagner));

app.use(express.static('../../twimapp'));

app.use(function(err, req, res, next) {
    log.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000);
console.log('Listening on port 3000!');

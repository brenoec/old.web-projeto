var fs = require('fs');
var http= require('http');
var https = require('https');
var privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
var certificate = fs.readFileSync('ssl/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var express = require('express');
var session = require('express-session');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var signout = require('./routes/signout');
var start = require('./routes/start');
var users = require('./routes/users');
var help = require('./routes/help');

// connects to mongodb
var mongoose = require('mongoose');
var mongo;

mongo = 'mongodb://localhost/domorrow';
mongo = 'mongodb://dOtNkoYYXpZi:uzxksOcXbfEl@mongosoup-cont002.mongosoup.de:31558/cc_dOtNkoYYXpZi';
mongoose.connect(mongo);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection'));
db.once('open', function callback () {
  console.log('mongoose connection [Opened: connected to [' + mongo + ']]');
});

var app = express();
//http.createServer(app).listen(80);
//https.createServer(credentials, app).listen(443);

// trust first proxy
app.set('trust proxy', 1);

app.use(session({
  secret: 'the big fat unicorn',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(''));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('httpssec', 0);

app.use('*', function(req, res, next) {

  if(req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }

  // verify session
  else if (!req.session.active && req.url !== '/') {
    res.redirect('https://' + req.headers.host + '/');
  } else if (req.session.active && req.url === '/') {
    res.redirect('https://' + req.headers.host + '/start');
  } else {
    next();
  }
});

//app.all('*', function(req, res, next) {
  // force https
//  if (req.connection.encrypted === undefined) {
//    res.redirect('https://' + req.headers.host + '/');
//  }


//});

app.use('/', routes);
app.use('/signout', signout);
app.use('/start', start);
app.use('/users', users);
app.use('/help', help);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
